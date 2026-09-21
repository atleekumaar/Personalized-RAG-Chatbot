import type { Chunk, SourcePage } from "./types";

export const CHUNK_SIZE = 900;
export const CHUNK_OVERLAP = 140;

function headingFrom(text: string): string | null {
  const line = text.split("\n").find((l) => l.trim().length > 0) ?? "";
  const match = line.match(/^#{1,3}\s+(.+)$/);
  if (match?.[1]) return match[1].replace(/\*+/g, "").trim();
  if (line.length > 0 && line.length < 80 && !line.endsWith(".")) {
    return line.trim();
  }
  return null;
}

function splitLong(text: string, chunkSize: number, overlap: number): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];
  if (clean.length <= chunkSize) return [clean];

  const paragraphs = clean.split(/\n{2,}/);
  const parts: string[] = [];
  let buffer = "";

  const flush = () => {
    const next = buffer.trim();
    if (next) parts.push(next);
    buffer = overlap > 0 && next ? next.slice(-overlap) : "";
  };

  for (const para of paragraphs) {
    const piece = para.trim();
    if (!piece) continue;
    if (piece.length > chunkSize) {
      if (buffer) flush();
      for (let i = 0; i < piece.length; i += chunkSize - overlap) {
        parts.push(piece.slice(i, i + chunkSize).trim());
      }
      buffer = "";
      continue;
    }
    const candidate = buffer ? `${buffer}\n\n${piece}` : piece;
    if (candidate.length > chunkSize && buffer) {
      flush();
      buffer = buffer ? `${buffer.trim()}\n\n${piece}` : piece;
      if (buffer.length > chunkSize) {
        parts.push(buffer.slice(0, chunkSize).trim());
        buffer = buffer.slice(-overlap);
      }
    } else {
      buffer = candidate;
    }
  }
  if (buffer.trim()) parts.push(buffer.trim());
  return parts.filter(Boolean);
}

export function chunkPages(
  docId: string,
  source: string,
  pages: SourcePage[],
  chunkSize = CHUNK_SIZE,
  overlap = CHUNK_OVERLAP,
): Chunk[] {
  const chunks: Chunk[] = [];
  let index = 0;
  for (const page of pages) {
    const pieces = splitLong(page.text, chunkSize, overlap);
    for (const text of pieces) {
      chunks.push({
        id: `${docId}:${index}`,
        docId,
        source,
        page: page.page,
        heading: page.heading ?? headingFrom(text),
        text,
      });
      index += 1;
    }
  }
  return chunks;
}

export function pagesFromMarkdown(markdown: string): SourcePage[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const sections = normalized.split(/(?=^#{1,3} )/m).filter((s) => s.trim());
  if (sections.length <= 1) {
    return [{ page: null, heading: headingFrom(normalized), text: normalized }];
  }
  return sections.map((section) => ({
    page: null,
    heading: headingFrom(section),
    text: section.trim(),
  }));
}
