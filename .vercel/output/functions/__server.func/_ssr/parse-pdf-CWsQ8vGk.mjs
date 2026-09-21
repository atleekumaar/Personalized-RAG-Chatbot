import { n as getDocument, t as GlobalWorkerOptions } from "../_libs/pdfjs-dist.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parse-pdf-CWsQ8vGk.js
var pdf_worker_min_default = "/assets/pdf.worker.min-Dswkl-cV.mjs";
var workerReady = false;
function ensureWorker() {
	if (workerReady) return;
	GlobalWorkerOptions.workerSrc = pdf_worker_min_default;
	workerReady = true;
}
function isTextItem(item) {
	return typeof item === "object" && item !== null && "str" in item && typeof item.str === "string";
}
async function extractPdfPages(data) {
	if (typeof window === "undefined") throw new Error("PDF parsing runs in the browser.");
	ensureWorker();
	const bytes = new Uint8Array(data);
	const pdf = await getDocument({ data: bytes }).promise;
	const pageCount = Math.min(pdf.numPages, 40);
	const pages = [];
	for (let i = 1; i <= pageCount; i += 1) {
		const content = await (await pdf.getPage(i)).getTextContent();
		const line = [];
		for (const item of content.items) if (isTextItem(item) && item.str.trim()) line.push(item.str);
		const text = line.join(" ").replace(/\s+/g, " ").trim();
		if (text) pages.push({
			page: i,
			heading: null,
			text
		});
	}
	if (pages.length === 0) throw new Error("That PDF has no extractable text. Scanned images need a text layer.");
	return pages;
}
//#endregion
export { extractPdfPages };
