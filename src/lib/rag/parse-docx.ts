import JSZip from "jszip";
import { pagesFromMarkdown } from "./chunk";
import type { SourcePage } from "./types";

export async function extractDocxPages(data: ArrayBuffer): Promise<SourcePage[]> {
  try {
    const zip = await JSZip.loadAsync(data);
    const docXml = await zip.file("word/document.xml")?.async("string");
    if (!docXml) {
      throw new Error("Could not extract document.xml from this Word file.");
    }

    const paragraphs: string[] = [];
    const pMatches = docXml.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g);
    for (const pMatch of pMatches) {
      const pContent = pMatch[1];
      const tMatches = [...pContent.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)];
      const pText = tMatches.map((m) => m[1]).join("").trim();
      if (pText) {
        paragraphs.push(pText);
      }
    }

    const fullText = paragraphs.join("\n\n").trim();
    if (!fullText) {
      throw new Error("That Word document has no extractable text.");
    }

    return pagesFromMarkdown(fullText);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to parse DOCX file.",
    );
  }
}
