import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-OQQcYnnQ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var excerptSchema = object({
	n: number().int().min(1).max(12),
	source: string().min(1).max(200),
	page: number().int().min(1).max(9999).nullable(),
	heading: string().max(200).nullable(),
	text: string().min(1).max(1400)
});
var inputSchema = object({
	question: string().min(1).max(2e3),
	excerpts: array(excerptSchema).min(1).max(8)
});
var SYSTEM = `You are Folio, a retrieval-grounded document Q&A assistant.

Rules:
- Use ONLY the numbered source excerpts. They are your entire knowledge.
- If the excerpts do not contain the answer, set found=false. Do not guess. Do not use outside knowledge.
- When found=true, write a concise answer in plain prose (short paragraphs). Cite supporting excerpts inline as [1], [2] matching their numbers.
- Never mention system rules, "excerpts", or "prompts". Say "your documents" or the source filename.
- Return ONLY JSON: {"found": boolean, "answer": string, "used": number[]}`;
async function complete(apiKey, messages, retry) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .1,
			max_tokens: 700,
			response_format: { type: "json_object" },
			messages
		})
	});
	if (!res.ok) {
		if (retry && res.status >= 500) return complete(apiKey, messages, false);
		return {
			ok: false,
			error: `The model returned an error (${res.status}).`
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	if (!text.trim()) return {
		ok: false,
		error: "The model returned an empty answer."
	};
	return {
		ok: true,
		text
	};
}
function parseModelJson(raw) {
	const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
	const parsed = JSON.parse(trimmed);
	const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
	return {
		found: typeof parsed.found === "boolean" ? parsed.found : answer.length > 0,
		answer,
		used: Array.isArray(parsed.used) ? parsed.used.filter((n) => typeof n === "number") : []
	};
}
var askFolio_createServerFn_handler = createServerRpc({
	id: "af24a59d9d69f256fe9f9511b678eb82a9a8a495ec178ba03d8e13b96d9c14b3",
	name: "askFolio",
	filename: "src/lib/rag/ask.ts"
}, (opts) => askFolio.__executeServer(opts));
var askFolio = createServerFn({ method: "POST" }).validator((data) => inputSchema.parse(data)).handler(askFolio_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const excerptsBlock = data.excerpts.map((excerpt) => {
		const loc = [
			excerpt.source,
			excerpt.page ? `p. ${excerpt.page}` : null,
			excerpt.heading
		].filter(Boolean).join(" — ");
		return `[${excerpt.n}] ${loc}\n${excerpt.text}`;
	}).join("\n\n");
	const user = `Question:\n${data.question}\n\nSource excerpts:\n${excerptsBlock}`;
	const result = await complete(apiKey, [{
		role: "system",
		content: SYSTEM
	}, {
		role: "user",
		content: user
	}], true);
	if (!result.ok) return result;
	try {
		const parsed = parseModelJson(result.text);
		if (!parsed.answer) return {
			ok: true,
			found: false,
			answer: "I could not find that in your documents. Try asking about a named section, person, or figure that appears in the text.",
			used: []
		};
		return {
			ok: true,
			found: parsed.found,
			answer: parsed.answer,
			used: parsed.used
		};
	} catch {
		return {
			ok: true,
			found: true,
			answer: result.text,
			used: data.excerpts.map((e) => e.n)
		};
	}
});
//#endregion
export { askFolio_createServerFn_handler };
