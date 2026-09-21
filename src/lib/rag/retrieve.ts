import type { Chunk, Excerpt } from "./types";

const STOP = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "as",
  "at",
  "by",
  "it",
  "that",
  "this",
  "with",
  "from",
  "your",
  "you",
  "we",
  "our",
  "their",
  "its",
  "not",
  "do",
  "does",
  "did",
  "if",
  "but",
  "can",
  "will",
  "into",
  "than",
  "then",
  "so",
  "about",
  "what",
  "when",
  "who",
  "how",
  "which",
  "where",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function retrieveChunks(
  query: string,
  chunks: Chunk[],
  k = 6,
): Excerpt[] {
  if (chunks.length === 0) return [];
  const limit = Math.min(Math.max(k, 1), 8);
  const qTokens = tokenize(query);
  const N = chunks.length;

  if (qTokens.length === 0) {
    return toExcerpts(chunks.slice(0, limit));
  }

  const tokenized = chunks.map((c) =>
    tokenize(`${c.source} ${c.heading ?? ""} ${c.text}`),
  );
  const df = new Map<string, number>();
  for (const tokens of tokenized) {
    for (const t of new Set(tokens)) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const avgdl =
    tokenized.reduce((sum, tokens) => sum + tokens.length, 0) / Math.max(N, 1);
  const k1 = 1.5;
  const b = 0.75;

  const scored = chunks.map((chunk, i) => {
    const tfMap = new Map<string, number>();
    for (const t of tokenized[i] ?? []) {
      tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
    }
    const dl = tokenized[i]?.length ?? 0;
    let score = 0;
    for (const qt of qTokens) {
      const tf = tfMap.get(qt) ?? 0;
      if (!tf) continue;
      const n = df.get(qt) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score +=
        idf *
        ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / Math.max(avgdl, 1)))));
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const positive = scored.filter((s) => s.score > 0).slice(0, limit);
  if (positive.length > 0) {
    return toExcerpts(positive.map((s) => s.chunk));
  }

  const seen = new Set<string>();
  const fallback: Chunk[] = [];
  for (const chunk of chunks) {
    if (seen.has(chunk.docId)) continue;
    seen.add(chunk.docId);
    fallback.push(chunk);
    if (fallback.length >= limit) break;
  }
  return toExcerpts(fallback);
}

function toExcerpts(chunks: Chunk[]): Excerpt[] {
  return chunks.map((chunk, i) => ({
    n: i + 1,
    source: chunk.source,
    page: chunk.page,
    heading: chunk.heading,
    text: chunk.text.slice(0, 1400),
  }));
}

export function expandFollowUpQuery(
  current: string,
  previousUser: string | undefined,
): string {
  const tokens = tokenize(current);
  if (!previousUser) return current;
  if (tokens.length >= 6) return current;
  return `${previousUser} ${current}`;
}

function tidySentence(raw: string): string {
  return raw
    .replace(/^#+\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\|/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildExtractiveAnswer(
  question: string,
  excerpts: Excerpt[],
): { found: boolean; answer: string; used: number[] } {
  const qTokens = tokenize(question);
  const hits: { n: number; sentence: string; score: number }[] = [];

  for (const excerpt of excerpts) {
    const sentences = excerpt.text
      .split(/(?<=[.!?])\s+|\n+/)
      .map(tidySentence)
      .filter((s) => s.length > 24 && /[a-zA-Z]/.test(s));
    for (const sentence of sentences) {
      const tokens = tokenize(sentence);
      if (tokens.length === 0) continue;
      const set = new Set(tokens);
      let overlap = 0;
      for (const t of qTokens) {
        if (set.has(t)) overlap += 1;
      }
      if (overlap === 0) continue;
      hits.push({
        n: excerpt.n,
        sentence,
        score: overlap / Math.sqrt(tokens.length),
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  const picked: typeof hits = [];
  const seen = new Set<string>();
  for (const hit of hits) {
    const key = hit.sentence.slice(0, 72);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(hit);
    if (picked.length >= 3) break;
  }

  if (picked.length === 0) {
    return {
      found: false,
      answer:
        "I could not find that in your documents. Try asking about a named section, person, or figure that appears in the text.",
      used: [],
    };
  }

  return {
    found: true,
    answer: picked.map((p) => `${p.sentence} [${p.n}]`).join("\n\n"),
    used: [...new Set(picked.map((p) => p.n))],
  };
}
