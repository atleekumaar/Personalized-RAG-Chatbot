import { Files } from "lucide-react";
import { ChatPanel } from "@/components/folio/chat-panel";
import { LibraryPanel } from "@/components/folio/library-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SourceDoc } from "@/lib/rag/types";

type WorkspaceProps = {
  docs: SourceDoc[];
  ingesting: boolean;
  libraryOpen: boolean;
  onUpload: () => void;
  onSample: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenLibrary: (open: boolean) => void;
};

export function Workspace({
  docs,
  ingesting,
  libraryOpen,
  onUpload,
  onSample,
  onRemove,
  onClear,
  onOpenLibrary,
}: WorkspaceProps) {
  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-80 shrink-0 border-r border-border md:block">
        <LibraryPanel
          docs={docs}
          ingesting={ingesting}
          onUpload={onUpload}
          onSample={onSample}
          onRemove={onRemove}
          onClear={onClear}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 md:hidden">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenLibrary(true)}
            className="min-h-11"
          >
            <Files className="size-4" />
            Sources
            <span className="tabular-nums text-muted">{docs.length}</span>
          </Button>
          <Badge>Grounded only</Badge>
        </div>
        <ChatPanel />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          libraryOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close sources"
          onClick={() => onOpenLibrary(false)}
          className={cn(
            "absolute inset-0 bg-bg/70 transition-opacity duration-200 ease-out-soft",
            libraryOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-80 max-w-full transform-gpu transition-transform duration-300 ease-out-soft",
            libraryOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <LibraryPanel
            docs={docs}
            ingesting={ingesting}
            onUpload={onUpload}
            onSample={onSample}
            onRemove={onRemove}
            onClear={onClear}
            onClose={() => onOpenLibrary(false)}
          />
        </div>
      </div>
    </div>
  );
}
