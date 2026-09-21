import { ArrowUp, ShieldCheck, ShieldAlert, Files } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askFolio } from "@/lib/rag/ask";
import { SAMPLE_QUESTIONS } from "@/lib/rag/sample";
import { expandFollowUpQuery, retrieveChunks } from "@/lib/rag/retrieve";
import type { ChatCitation, ChatMessage, Excerpt } from "@/lib/rag/types";
import { cn } from "@/lib/utils";
import { useFolio } from "@/store/folio";

export function ChatPanel() {
  const docs = useFolio((s) => s.docs);
  const chunks = useFolio((s) => s.chunks);
  const messages = useFolio((s) => s.messages);
  const asking = useFolio((s) => s.asking);
  const addMessage = useFolio((s) => s.addMessage);
  const patchMessage = useFolio((s) => s.patchMessage);
  const setAsking = useFolio((s) => s.setAsking);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (docs.some((d) => d.kind === "sample")) return SAMPLE_QUESTIONS;
    const headings = chunks
      .map((c) => c.heading)
      .filter((h): h is string => Boolean(h && h.length > 3 && h.length < 60));
    const unique = [...new Set(headings)].slice(0, 4);
    return unique.map((h) => `What does the document say about ${h}?`);
  }, [chunks, docs]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, asking]);

  async function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || asking || chunks.length === 0) return;
    setDraft("");

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    addMessage(userMsg);

    const previous = [...useFolio.getState().messages]
      .filter((m) => m.role === "user")
      .at(-2)?.content;
    const query = expandFollowUpQuery(trimmed, previous);
    const excerpts = retrieveChunks(query, chunks, 6);

    const assistantId = crypto.randomUUID();
    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
    });
    setAsking(true);

    try {
      const result = await askFolio({ data: { question: trimmed, excerpts } });
      if (!result.ok) {
        patchMessage(assistantId, {
          error: result.error,
          content: result.error,
        });
        toast.error(result.error);
        return;
      }
      const used = new Set(result.used);
      const citations: ChatCitation[] = excerpts
        .filter((e) => used.size === 0 || used.has(e.n))
        .map((e) => excerptToCitation(e));
      patchMessage(assistantId, {
        content: result.answer,
        found: result.found,
        mode: result.mode,
        citations: result.found ? citations : citations.slice(0, 3),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong asking Folio.";
      patchMessage(assistantId, { error: message, content: message });
      toast.error(message);
    } finally {
      setAsking(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(draft);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {empty ? (
          <EmptyChat
            suggestions={suggestions}
            onPick={(q) => void submit(q)}
            disabled={asking}
          />
        ) : (
          <ol className="mx-auto flex max-w-2xl flex-col gap-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} pending={asking} />
            ))}
          </ol>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="safe-pad-b border-t border-border bg-bg/80 px-4 py-3 sm:px-8"
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-xl bg-surface p-2 hairline">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask something in the documents…"
            rows={1}
            maxLength={2000}
            disabled={asking || chunks.length === 0}
            className="max-h-36 min-h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
            aria-label="Question"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0"
            disabled={asking || !draft.trim() || chunks.length === 0}
            aria-label="Send question"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-subtle">
          Answers are retrieved from your library only.
        </p>
      </form>
    </div>
  );
}

function EmptyChat({
  suggestions,
  onPick,
  disabled,
}: {
  suggestions: string[];
  onPick: (q: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start pt-4 sm:pt-12">
      <p className="font-display text-2xl text-fg">Your library is ready.</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Ask a question. Folio will retrieve matching passages and refuse
        anything the pages do not support.
      </p>
      {suggestions.length > 0 ? (
        <ul className="mt-6 flex w-full flex-col gap-2">
          {suggestions.map((q) => (
            <li key={q}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(q)}
                className="w-full rounded-lg bg-raised px-4 py-3 text-left text-sm text-fg transition-colors duration-150 hairline hover:bg-raised/70 disabled:opacity-50"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MessageBubble({
  message,
  pending,
}: {
  message: ChatMessage;
  pending: boolean;
}) {
  if (message.role === "user") {
    return (
      <li className="flex justify-end">
        <div className="max-w-xl rounded-xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-fg">
          {message.content}
        </div>
      </li>
    );
  }

  const waiting = pending && !message.content && !message.error;

  return (
    <li className="flex justify-start">
      <div className="w-full max-w-2xl rounded-xl rounded-bl-md bg-raised px-4 py-4 hairline">
        {waiting ? (
          <p className="shimmer-text text-sm">Reading sources…</p>
        ) : (
          <>
            <div className="mb-3">
              {message.error ? (
                <Badge tone="danger">
                  <ShieldAlert className="size-3" />
                  Could not answer
                </Badge>
              ) : message.found === false ? (
                <Badge tone="warn">
                  <ShieldAlert className="size-3" />
                  Not in your documents
                </Badge>
              ) : message.mode === "passages" ? (
                <Badge>
                  <Files className="size-3" />
                  Matching passages
                </Badge>
              ) : (
                <Badge tone="ok">
                  <ShieldCheck className="size-3" />
                  Grounded
                </Badge>
              )}
            </div>
            <AnswerBody text={message.content} citations={message.citations ?? []} />
            {message.mode === "passages" && message.found ? (
              <p className="mt-3 text-xs text-subtle">
                Live synthesis is paused. These lines are taken from your files.
              </p>
            ) : null}
            {message.citations && message.citations.length > 0 && message.found !== false ? (
              <CitationList citations={message.citations} />
            ) : null}
          </>
        )}
      </div>
    </li>
  );
}

function AnswerBody({
  text,
  citations,
}: {
  text: string;
  citations: ChatCitation[];
}) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-fg">
      {paragraphs.map((para, i) => (
        <p key={i}>{renderCited(para, citations)}</p>
      ))}
    </div>
  );
}

function renderCited(text: string, citations: ChatCitation[]) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (!match) return <span key={i}>{part}</span>;
    const n = Number(match[1]);
    const citation = citations.find((c) => c.n === n);
    return (
      <sup
        key={i}
        className={cn(
          "ml-0.5 inline-flex size-4 translate-y-px items-center justify-center rounded-sm bg-bg text-2xs font-medium text-muted tabular-nums",
        )}
        title={citation ? citation.source : `Source ${n}`}
      >
        {n}
      </sup>
    );
  });
}

function CitationList({ citations }: { citations: ChatCitation[] }) {
  const [open, setOpen] = useState<number | null>(citations[0]?.n ?? null);
  return (
    <div className="mt-4 border-t border-border pt-3">
      <p className="text-2xs font-medium tracking-[0.14em] text-subtle uppercase">
        Sources
      </p>
      <ul className="mt-2 space-y-2">
        {citations.map((c) => {
          const expanded = open === c.n;
          return (
            <li key={c.n}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : c.n)}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-xs text-muted transition-colors duration-150 hover:bg-bg hover:text-fg"
              >
                <span className="min-w-0 truncate">
                  <span className="mr-2 font-medium text-fg tabular-nums">[{c.n}]</span>
                  {c.source}
                  {c.page ? ` · p. ${c.page}` : ""}
                  {c.heading ? ` · ${c.heading}` : ""}
                </span>
                <span className="shrink-0 text-subtle">{expanded ? "Hide" : "Show"}</span>
              </button>
              {expanded ? (
                <blockquote className="mt-1 rounded-md bg-bg px-3 py-2 text-xs leading-relaxed text-muted">
                  {c.quote}
                </blockquote>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function excerptToCitation(excerpt: Excerpt): ChatCitation {
  return {
    n: excerpt.n,
    source: excerpt.source,
    page: excerpt.page,
    heading: excerpt.heading,
    quote: excerpt.text.length > 280 ? `${excerpt.text.slice(0, 277)}…` : excerpt.text,
  };
}
