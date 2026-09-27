import { FileText, Globe, Plus, Trash2, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchWebpage } from "@/lib/rag/fetch-url";
import { ingestUrlContent } from "@/lib/rag/ingest";
import { cn } from "@/lib/utils";
import type { Chunk, SourceDoc } from "@/lib/rag/types";

type LibraryPanelProps = {
  docs: SourceDoc[];
  ingesting: boolean;
  onUpload: () => void;
  onSample: () => void;
  onAddDoc: (doc: SourceDoc, chunks: Chunk[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose?: () => void;
};

export function LibraryPanel({
  docs,
  ingesting,
  onUpload,
  onSample,
  onAddDoc,
  onRemove,
  onClear,
  onClose,
}: LibraryPanelProps) {
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const hasSample = docs.some((d) => d.kind === "sample");

  async function handleUrlSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      setFetchingUrl(true);
      const res = await fetchWebpage({ data: { url: trimmed } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const { doc, chunks } = ingestUrlContent(trimmed, res.title, res.text);
      onAddDoc(doc, chunks);
      toast.success(`Imported: ${res.title}`);
      setUrlInput("");
      setUrlModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to import URL");
    } finally {
      setFetchingUrl(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
            Sources
          </p>
          <p className="mt-1 text-sm text-subtle tabular-nums">
            {docs.length} {docs.length === 1 ? "document" : "documents"}
          </p>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            onClick={onClose}
            aria-label="Close sources"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 px-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onUpload}
          disabled={ingesting}
          className="w-full justify-start"
        >
          <Plus className="size-4" />
          Add PDF, DOCX, Text
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setUrlModalOpen(true)}
          disabled={ingesting}
          className="w-full justify-start"
        >
          <Globe className="size-4" />
          Import Webpage URL
        </Button>

        {!hasSample ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onSample}
            disabled={ingesting}
            className="w-full justify-start"
          >
            Load sample manual
          </Button>
        ) : null}
      </div>

      {urlModalOpen ? (
        <form onSubmit={handleUrlSubmit} className="mx-4 mt-3 rounded-lg bg-raised p-3 hairline">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg">Enter Web URL</span>
            <button
              type="button"
              onClick={() => setUrlModalOpen(false)}
              className="text-subtle hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <input
            type="url"
            required
            placeholder="https://example.com/article"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="mt-2 flex justify-end gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUrlModalOpen(false)}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={fetchingUrl || !urlInput.trim()}
              className="h-7 text-xs"
            >
              {fetchingUrl ? (
                <>
                  <Loader2 className="mr-1 size-3 animate-spin" />
                  Fetching…
                </>
              ) : (
                "Import"
              )}
            </Button>
          </div>
        </form>
      ) : null}

      <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex items-start gap-3 rounded-lg bg-raised p-3 hairline"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-bg text-muted">
              {doc.kind === "url" ? <Globe className="size-4" /> : <FileText className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg" title={doc.name}>{doc.name}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge>{kindLabel(doc.kind)}</Badge>
                <span className="text-xs text-subtle tabular-nums">
                  {countLabel(doc)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(doc.id)}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-md text-subtle transition-colors duration-150 hover:bg-bg hover:text-fg after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2"
              aria-label={`Remove ${doc.name}`}
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      {docs.length > 0 ? (
        <div className="border-t border-border px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className={cn("w-full text-subtle")}
          >
            <Trash2 className="size-3.5" />
            Clear library
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function kindLabel(kind: SourceDoc["kind"]) {
  if (kind === "pdf") return "PDF";
  if (kind === "docx") return "Word (DOCX)";
  if (kind === "markdown") return "Markdown";
  if (kind === "url") return "Web URL";
  if (kind === "sample") return "Sample";
  return "Text";
}

function countLabel(doc: SourceDoc) {
  if (doc.kind === "pdf") {
    return `${doc.pageCount} ${doc.pageCount === 1 ? "page" : "pages"}`;
  }
  return `${doc.pageCount} ${doc.pageCount === 1 ? "section" : "sections"}`;
}
