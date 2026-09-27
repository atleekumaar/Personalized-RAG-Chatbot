import { chunkPages, pagesFromMarkdown } from "./chunk";
import { MAX_CHARS, MAX_FILE_BYTES } from "./limits";
import { SAMPLE_DOC_NAME, SAMPLE_MARKDOWN } from "./sample";
import type { Chunk, SourceDoc, SourcePage } from "./types";

export { MAX_DOCS, MAX_FILE_BYTES, MAX_PAGES } from "./limits";

function newId(): string {
  return crypto.randomUUID();
}

function extKind(file: File): "pdf" | "markdown" | "text" | "docx" {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  if (
    type === "text/markdown" ||
    name.endsWith(".md") ||
    name.endsWith(".markdown") ||
    name.endsWith(".mdx")
  ) {
    return "markdown";
  }
  if (type === "text/plain" || name.endsWith(".txt")) return "text";
  throw new Error("Use a PDF, Word (DOCX), Markdown, or plain text file.");
}

function pagesToDoc(
  id: string,
  name: string,
  kind: SourceDoc["kind"],
  pages: SourcePage[],
): { doc: SourceDoc; chunks: Chunk[] } {
  const charCount = pages.reduce((sum, p) => sum + p.text.length, 0);
  if (charCount === 0) {
    throw new Error("No extractable text was found in that file.");
  }
  if (charCount > MAX_CHARS) {
    throw new Error("That file is too long. Try a shorter document.");
  }
  const printedPages = pages.filter((p) => p.page !== null).length;
  const doc: SourceDoc = {
    id,
    name,
    kind,
    pageCount: printedPages || pages.length || 1,
    charCount,
    addedAt: Date.now(),
  };
  return { doc, chunks: chunkPages(id, name, pages) };
}

export async function ingestFile(
  file: File,
): Promise<{ doc: SourceDoc; chunks: Chunk[] }> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Files must be 12 MB or smaller.");
  }
  const kind = extKind(file);
  const id = newId();

  if (kind === "pdf") {
    const { extractPdfPages } = await import("./parse-pdf");
    const pages = await extractPdfPages(await file.arrayBuffer());
    return pagesToDoc(id, file.name, "pdf", pages);
  }

  if (kind === "docx") {
    const { extractDocxPages } = await import("./parse-docx");
    const pages = await extractDocxPages(await file.arrayBuffer());
    return pagesToDoc(id, file.name, "docx", pages);
  }

  const text = await file.text();
  const pages = pagesFromMarkdown(text);
  return pagesToDoc(id, file.name, kind, pages);
}

export function ingestUrlContent(
  url: string,
  title: string,
  text: string,
): { doc: SourceDoc; chunks: Chunk[] } {
  const id = newId();
  const pages = pagesFromMarkdown(text);
  return pagesToDoc(id, `${title} (${new URL(url).hostname})`, "url", pages);
}

export function ingestSample(): { doc: SourceDoc; chunks: Chunk[] } {
  return pagesToDoc(
    newId(),
    SAMPLE_DOC_NAME,
    "sample",
    pagesFromMarkdown(SAMPLE_MARKDOWN),
  );
}
