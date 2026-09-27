import { Files, History } from "lucide-react";
import { useState } from "react";
import { ChatPanel } from "@/components/folio/chat-panel";
import { HistoryPanel } from "@/components/folio/history-panel";
import { LibraryPanel } from "@/components/folio/library-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Chunk, SourceDoc } from "@/lib/rag/types";
import { useFolio } from "@/store/folio";

type WorkspaceProps = {
  docs: SourceDoc[];
  ingesting: boolean;
  libraryOpen: boolean;
  onUpload: () => void;
  onSample: () => void;
  onAddDoc: (doc: SourceDoc, chunks: Chunk[]) => void;
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
  onAddDoc,
  onRemove,
  onClear,
  onOpenLibrary,
}: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"sources" | "history">("sources");
  const sessions = useFolio((s) => s.sessions);

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-80 shrink-0 flex-col border-r border-border md:flex">
        {/* Sidebar Nav Tabs */}
        <div className="flex border-b border-border bg-surface px-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-medium transition-colors",
              activeTab === "sources"
                ? "border-primary text-fg"
                : "border-transparent text-subtle hover:text-muted",
            )}
          >
            <Files className="size-3.5" />
            Sources
            <span className="rounded bg-raised px-1.5 py-0.5 text-2xs tabular-nums text-muted">
              {docs.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-medium transition-colors",
              activeTab === "history"
                ? "border-primary text-fg"
                : "border-transparent text-subtle hover:text-muted",
            )}
          >
            <History className="size-3.5" />
            History
            <span className="rounded bg-raised px-1.5 py-0.5 text-2xs tabular-nums text-muted">
              {sessions.length}
            </span>
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {activeTab === "sources" ? (
            <LibraryPanel
              docs={docs}
              ingesting={ingesting}
              onUpload={onUpload}
              onSample={onSample}
              onAddDoc={onAddDoc}
              onRemove={onRemove}
              onClear={onClear}
            />
          ) : (
            <HistoryPanel />
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveTab("sources");
                onOpenLibrary(true);
              }}
              className="min-h-11"
            >
              <Files className="size-4" />
              Sources
              <span className="tabular-nums text-muted">{docs.length}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab("history");
                onOpenLibrary(true);
              }}
              className="min-h-11"
            >
              <History className="size-4" />
              History
            </Button>
          </div>
          <Badge>Grounded only</Badge>
        </div>
        <ChatPanel />
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          libraryOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close panel"
          onClick={() => onOpenLibrary(false)}
          className={cn(
            "absolute inset-0 bg-bg/70 transition-opacity duration-200 ease-out-soft",
            libraryOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-80 max-w-full transform-gpu transition-transform duration-300 ease-out-soft flex flex-col bg-surface",
            libraryOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex border-b border-border bg-surface px-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("sources")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-medium transition-colors",
                activeTab === "sources"
                  ? "border-primary text-fg"
                  : "border-transparent text-subtle hover:text-muted",
              )}
            >
              <Files className="size-3.5" />
              Sources ({docs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-medium transition-colors",
                activeTab === "history"
                  ? "border-primary text-fg"
                  : "border-transparent text-subtle hover:text-muted",
              )}
            >
              <History className="size-3.5" />
              History ({sessions.length})
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {activeTab === "sources" ? (
              <LibraryPanel
                docs={docs}
                ingesting={ingesting}
                onUpload={onUpload}
                onSample={onSample}
                onAddDoc={onAddDoc}
                onRemove={onRemove}
                onClear={onClear}
                onClose={() => onOpenLibrary(false)}
              />
            ) : (
              <HistoryPanel onClose={() => onOpenLibrary(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
