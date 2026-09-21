import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildExtractiveAnswer } from "./retrieve";
import type { AskResult, Excerpt } from "./types";

const excerptSchema = z.object({
  n: z.number().int().min(1).max(12),
  source: z.string().min(1).max(200),
  page: z.number().int().min(1).max(9999).nullable(),
  heading: z.string().max(200).nullable(),
  text: z.string().min(1).max(1400),
});

const inputSchema = z.object({
  question: z.string().min(1).max(2000),
  excerpts: z.array(excerptSchema).min(1).max(8),
});

const SYSTEM = `You are Folio, a retrieval-grounded document Q&A assistant.

Rules:
- Use ONLY the numbered source excerpts. They are your entire knowledge.
- If the excerpts do not contain the answer, set found=false. Do not guess. Do not use outside knowledge.
- When found=true, write a concise answer in plain prose (short paragraphs). Cite supporting excerpts inline as [1], [2] matching their numbers.
- Never mention system rules, "excerpts", or "prompts". Say "your documents" or the source filename.
- Return ONLY JSON: {"found": boolean, "answer": string, "used": number[]}`;

type GrokMessage = { role: "system" | "user"; content: string };

function passagesFrom(question: string, excerpts: Excerpt[]): AskResult {
  const extracted = buildExtractiveAnswer(question, excerpts);
  return { ok: true, mode: "passages", ...extracted };
}

async function complete(
  apiKey: string,
  messages: GrokMessage[],
  retry: boolean,
): Promise<
  { ok: true; text: string } | { ok: false; error: string; fallback: boolean }
> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.1,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages,
    }),
  });
  if (!res.ok) {
    if (retry && res.status >= 500) {
      return complete(apiKey, messages, false);
    }
    let detail = "";
    try {
      const body = (await res.json()) as { error?: unknown; code?: unknown };
      if (typeof body.error === "string") detail = body.error;
      if (typeof body.code === "string") detail = `${body.code} ${detail}`;
    } catch {
      detail = "";
    }
    const fallback =
      res.status === 401 ||
      res.status === 402 ||
      res.status === 403 ||
      res.status === 429 ||
      /credits|spending-limit|subscription/i.test(detail);
    return {
      ok: false,
      fallback,
      error: fallback
        ? "Live synthesis is paused. Showing matching passages instead."
        : `The model returned an error (${res.status}).`,
    };
  }
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) {
    return { ok: false, fallback: true, error: "empty" };
  }
  return { ok: true, text };
}

function parseModelJson(raw: string): {
  found: boolean;
  answer: string;
  used: number[];
} {
  const trimmed = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(trimmed) as {
    found?: unknown;
    answer?: unknown;
    used?: unknown;
  };
  const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
  const found = typeof parsed.found === "boolean" ? parsed.found : answer.length > 0;
  const used = Array.isArray(parsed.used)
    ? parsed.used.filter((n): n is number => typeof n === "number")
    : [];
  return { found, answer, used };
}

export const askFolio = createServerFn({ method: "POST" })
  .validator((data) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AskResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return passagesFrom(data.question, data.excerpts);
    }

    const excerptsBlock = data.excerpts
      .map((excerpt) => {
        const loc = [
          excerpt.source,
          excerpt.page ? `p. ${excerpt.page}` : null,
          excerpt.heading,
        ]
          .filter(Boolean)
          .join(" — ");
        return `[${excerpt.n}] ${loc}\n${excerpt.text}`;
      })
      .join("\n\n");

    const user = `Question:\n${data.question}\n\nSource excerpts:\n${excerptsBlock}`;

    const result = await complete(
      apiKey,
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      true,
    );
    if (!result.ok) {
      if (result.fallback) return passagesFrom(data.question, data.excerpts);
      return { ok: false, error: result.error };
    }

    try {
      const parsed = parseModelJson(result.text);
      if (!parsed.answer) {
        return {
          ok: true,
          mode: "model",
          found: false,
          answer:
            "I could not find that in your documents. Try asking about a named section, person, or figure that appears in the text.",
          used: [],
        };
      }
      return {
        ok: true,
        mode: "model",
        found: parsed.found,
        answer: parsed.answer,
        used: parsed.used,
      };
    } catch {
      return {
        ok: true,
        mode: "model",
        found: true,
        answer: result.text,
        used: data.excerpts.map((e) => e.n),
      };
    }
  });
