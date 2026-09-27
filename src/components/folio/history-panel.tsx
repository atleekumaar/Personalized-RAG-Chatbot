import { Download, MessageSquare, Plus, Printer, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportChatToMarkdown, printChatToPdf } from "@/lib/rag/export";
import { cn } from "@/lib/utils";
import { useFolio } from "@/store/folio";

export function HistoryPanel({ onClose }: { onClose?: () => void }) {
  const sessions = useFolio((s) => s.sessions);
  const activeSessionId = useFolio((s) => s.activeSessionId);
  const docs = useFolio((s) => s.docs);
  const messages = useFolio((s) => s.messages);
  const createNewSession = useFolio((s) => s.createNewSession);
  const switchSession = useFolio((s) => s.switchSession);
  const deleteSession = useFolio((s) => s.deleteSession);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
            Chat History
          </p>
          <p className="mt-1 text-sm text-subtle tabular-nums">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </p>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            onClick={onClose}
            aria-label="Close history"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 px-4">
        <Button
          type="button"
          variant="secondary"
          onClick={createNewSession}
          className="w-full justify-start"
        >
          <Plus className="size-4" />
          New Conversation
        </Button>
      </div>

      <div className="mt-4 flex-1 space-y-1 overflow-y-auto px-4">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const msgCount = session.messages.length;
          return (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-lg p-2.5 transition-colors hairline",
                isActive
                  ? "bg-primary/10 text-fg font-medium"
                  : "bg-raised/60 text-muted hover:bg-raised hover:text-fg",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <MessageSquare className="size-4 shrink-0 text-subtle" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">{session.title}</p>
                  <p className="mt-0.5 text-2xs text-subtle">
                    {msgCount} {msgCount === 1 ? "msg" : "msgs"} · {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {sessions.length > 1 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="size-7 rounded-md text-subtle opacity-0 transition-opacity hover:bg-bg hover:text-fg group-hover:opacity-100 flex items-center justify-center"
                  aria-label="Delete session"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      {messages.length > 0 ? (
        <div className="border-t border-border px-4 py-3 space-y-2">
          <p className="text-2xs font-medium tracking-[0.14em] text-subtle uppercase">
            Export Active Chat
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => exportChatToMarkdown(messages, docs, activeSession?.title)}
              className="text-xs justify-start h-8"
            >
              <Download className="size-3.5 mr-1.5" />
              Markdown
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={printChatToPdf}
              className="text-xs justify-start h-8"
            >
              <Printer className="size-3.5 mr-1.5" />
              PDF / Print
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
