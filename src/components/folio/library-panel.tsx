import { FileText, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SourceDoc } from "@/lib/rag/types";

type LibraryPanelProps = {
  docs: SourceDoc[];
  ingesting: boolean;
  onUpload: () => void;
  onSample: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose?: () => void;
};

export function LibraryPanel({
  docs,
  ingesting,
  onUpload,
  onSample,
  onRemove,
  onClear,
  onClose,
}: LibraryPanelProps) {
  const hasSample = docs.some((d) => d.kind === "sample");

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
          Add PDF or Markdown
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

      <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex items-start gap-3 rounded-lg bg-raised p-3 hairline"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-bg text-muted">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{doc.name}</p>
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
  if (kind === "markdown") return "Markdown";
  if (kind === "sample") return "Sample";
  return "Text";
}

function countLabel(doc: SourceDoc) {
  if (doc.kind === "pdf") {
    return `${doc.pageCount} ${doc.pageCount === 1 ? "page" : "pages"}`;
  }
  return `${doc.pageCount} ${doc.pageCount === 1 ? "section" : "sections"}`;
}
