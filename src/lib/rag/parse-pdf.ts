import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { MAX_PAGES } from "./limits";
import type { SourcePage } from "./types";

let workerReady = false;

function ensureWorker() {
  if (workerReady) return;
  GlobalWorkerOptions.workerSrc = pdfWorker;
  workerReady = true;
}

function isTextItem(item: unknown): item is { str: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    typeof (item as { str: unknown }).str === "string"
  );
}

export async function extractPdfPages(
  data: ArrayBuffer,
): Promise<SourcePage[]> {
  if (typeof window === "undefined") {
    throw new Error("PDF parsing runs in the browser.");
  }
  ensureWorker();
  const bytes = new Uint8Array(data);
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  const pages: SourcePage[] = [];

  for (let i = 1; i <= pageCount; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line: string[] = [];
    for (const item of content.items) {
      if (isTextItem(item) && item.str.trim()) {
        line.push(item.str);
      }
    }
    const text = line.join(" ").replace(/\s+/g, " ").trim();
    if (text) {
      pages.push({ page: i, heading: null, text });
    }
  }

  if (pages.length === 0) {
    throw new Error(
      "That PDF has no extractable text. Scanned images need a text layer.",
    );
  }
  return pages;
}
