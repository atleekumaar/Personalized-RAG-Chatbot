import { ArrowUp, Check, Copy, ExternalLink, FileText, Files, Mic, MicOff, ShieldAlert, ShieldCheck, Sparkles, User, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechToText, useTextToSpeech } from "@/lib/audio/voice";
import { askFolio } from "@/lib/rag/ask";
import { expandFollowUpQuery, retrieveChunks } from "@/lib/rag/retrieve";
import { SAMPLE_QUESTIONS } from "@/lib/rag/sample";
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
  const [selectedCitation, setSelectedCitation] = useState<ChatCitation | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const { isListening, isSupported: speechSupported, toggleListening } = useSpeechToText((text) => {
    setDraft(text);
  });

  const { speakingId, speak, stop } = useTextToSpeech();

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

  async function streamTypewriter(assistantId: string, fullText: string) {
    const words = fullText.split(" ");
    let current = "";
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? "" : " ") + words[i];
      patchMessage(assistantId, { content: current });
      if (i % 3 === 0) {
        await new Promise((r) => setTimeout(r, 18));
      }
    }
  }

  async function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || asking || chunks.length === 0) return;
    setDraft("");
    stop();

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
        found: result.found,
        mode: result.mode,
        citations: result.found ? citations : citations.slice(0, 3),
      });

      await streamTypewriter(assistantId, result.answer);
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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {empty ? (
          <EmptyChat
            suggestions={suggestions}
            onPick={(q) => void submit(q)}
            disabled={asking}
          />
        ) : (
          <ol className="mx-auto flex max-w-2xl flex-col gap-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                pending={asking}
                speaking={speakingId === message.id}
                onSpeak={() => speak(message.id, message.content)}
                onSelectCitation={setSelectedCitation}
              />
            ))}
          </ol>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="safe-pad-b shrink-0 border-t border-border bg-surface/60 backdrop-blur-md px-4 py-3 sm:px-8"
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl bg-surface p-2 hairline shadow-lg border border-border/80 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          {speechSupported ? (
            <Button
              type="button"
              variant={isListening ? "danger" : "ghost"}
              size="icon"
              onClick={toggleListening}
              className={cn("size-10 shrink-0 rounded-xl", isListening && "animate-pulse")}
              title={isListening ? "Listening… click to stop" : "Voice input"}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4 text-muted" />}
            </Button>
          ) : null}

          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isListening ? "Listening to your voice…" : "Ask something grounded in the documents…"}
            rows={1}
            maxLength={2000}
            disabled={asking || chunks.length === 0}
            className="max-h-36 min-h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-subtle"
            aria-label="Question"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-xl bg-primary text-primary-fg hover:opacity-90 shadow-md"
            disabled={asking || !draft.trim() || chunks.length === 0}
            aria-label="Send question"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
        <div className="mx-auto mt-2 max-w-2xl flex items-center justify-between px-1 text-2xs text-subtle">
          <span>Answers retrieved strictly from your uploaded sources</span>
          <span>Zero Hallucination</span>
        </div>
      </form>

      {/* Interactive Source Pop-up Modal */}
      {selectedCitation ? (
        <SourceModal
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      ) : null}
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
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-2xs font-medium text-primary">
        <Sparkles className="size-3" />
        <span>Grounded Intelligence</span>
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-fg">Your library is ready.</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Ask any question via text or voice. Folio will search matching passages and stream
        answers grounded only in your sources. Click on any verified source to see the exact paragraph!
      </p>
      {suggestions.length > 0 ? (
        <ul className="mt-6 flex w-full flex-col gap-2.5">
          {suggestions.map((q) => (
            <li key={q}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(q)}
                className="w-full rounded-xl bg-raised/80 px-4 py-3.5 text-left text-sm text-fg transition-all duration-150 hairline hover:bg-raised hover:border-primary/40 disabled:opacity-50 border border-transparent shadow-sm flex items-center justify-between group"
              >
                <span>{q}</span>
                <ArrowUp className="size-3.5 text-subtle group-hover:text-primary rotate-45 transition-transform" />
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
  speaking,
  onSpeak,
  onSelectCitation,
}: {
  message: ChatMessage;
  pending: boolean;
  speaking?: boolean;
  onSpeak?: () => void;
  onSelectCitation: (citation: ChatCitation) => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyContent() {
    if (!message.content) return;
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  if (message.role === "user") {
    return (
      <li className="flex justify-end items-start gap-2.5">
        <div className="max-w-xl rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-fg shadow-md">
          {message.content}
        </div>
        <div className="size-7 rounded-full bg-raised border border-border flex items-center justify-center shrink-0 text-muted">
          <User className="size-3.5" />
        </div>
      </li>
    );
  }

  const waiting = pending && !message.content && !message.error;

  return (
    <li className="flex justify-start items-start gap-2.5">
      <div className="size-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary mt-1">
        <Sparkles className="size-3.5" />
      </div>

      <div className="w-full max-w-2xl rounded-2xl rounded-tl-sm bg-raised/90 px-4 py-4 hairline border border-border/70 shadow-md">
        {waiting ? (
          <div className="flex items-center gap-2 py-1">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            <p className="shimmer-text text-sm">Searching sources & generating grounded response…</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2.5">
              <div>
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
                    Grounded Answer
                  </Badge>
                )}
              </div>

              {message.content && !message.error ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={copyContent}
                    className="flex size-7 items-center justify-center rounded-md text-subtle transition-colors hover:bg-bg hover:text-fg"
                    title="Copy answer"
                    aria-label="Copy answer"
                  >
                    {copied ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
                  </button>

                  {onSpeak ? (
                    <button
                      type="button"
                      onClick={onSpeak}
                      className="flex size-7 items-center justify-center rounded-md text-subtle transition-colors hover:bg-bg hover:text-fg"
                      title={speaking ? "Stop audio" : "Listen to answer"}
                      aria-label="Audio read-out"
                    >
                      {speaking ? <VolumeX className="size-3.5 text-primary" /> : <Volume2 className="size-3.5" />}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            <AnswerBody
              text={message.content}
              citations={message.citations ?? []}
              onSelectCitation={onSelectCitation}
            />

            {message.mode === "passages" && message.found ? (
              <p className="mt-3 text-xs text-subtle">
                Live synthesis is paused. These lines are taken from your files.
              </p>
            ) : null}

            {message.citations && message.citations.length > 0 && message.found !== false ? (
              <CitationList
                citations={message.citations}
                onSelectCitation={onSelectCitation}
              />
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
  onSelectCitation,
}: {
  text: string;
  citations: ChatCitation[];
  onSelectCitation: (citation: ChatCitation) => void;
}) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-fg">
      {paragraphs.map((para, i) => (
        <p key={i}>{renderCited(para, citations, onSelectCitation)}</p>
      ))}
    </div>
  );
}

function renderCited(
  text: string,
  citations: ChatCitation[],
  onSelectCitation: (citation: ChatCitation) => void,
) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (!match) return <span key={i}>{part}</span>;
    const n = Number(match[1]);
    const citation = citations.find((c) => c.n === n);
    return (
      <button
        key={i}
        type="button"
        onClick={() => citation && onSelectCitation(citation)}
        className={cn(
          "mx-0.5 inline-flex size-5 translate-y-px items-center justify-center rounded bg-primary/15 text-2xs font-semibold text-primary tabular-nums border border-primary/30 hover:bg-primary hover:text-primary-fg transition-all cursor-pointer shadow-xs",
        )}
        title={citation ? `Click to view source excerpt from ${citation.source}` : `Source ${n}`}
      >
        {n}
      </button>
    );
  });
}

function CitationList({
  citations,
  onSelectCitation,
}: {
  citations: ChatCitation[];
  onSelectCitation: (citation: ChatCitation) => void;
}) {
  return (
    <div className="mt-4 border-t border-border/60 pt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xs font-semibold tracking-[0.14em] text-subtle uppercase">
          Verified Sources ({citations.length})
        </p>
        <span className="text-2xs text-muted">Click to view source excerpt</span>
      </div>
      <ul className="space-y-1.5">
        {citations.map((c) => (
          <li key={c.n}>
            <button
              type="button"
              onClick={() => onSelectCitation(c)}
              className="group flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs text-muted transition-all duration-150 bg-bg/50 hover:bg-bg hover:text-fg border border-border/60 hover:border-primary/50 shadow-xs"
            >
              <span className="min-w-0 truncate flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded bg-primary/10 text-primary font-semibold text-2xs tabular-nums shrink-0">
                  {c.n}
                </span>
                <span className="truncate font-medium text-fg">{c.source}</span>
                {c.page ? <span className="text-2xs text-subtle">· p. {c.page}</span> : null}
                {c.heading ? <span className="truncate text-2xs text-subtle">· {c.heading}</span> : null}
              </span>
              <span className="shrink-0 flex items-center gap-1 text-2xs font-medium text-primary group-hover:underline">
                View Source <ExternalLink className="size-3" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceModal({
  citation,
  onClose,
}: {
  citation: ChatCitation;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyQuote() {
    void navigator.clipboard.writeText(citation.quote);
    setCopied(true);
    toast.success("Source excerpt copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border/60 pb-3.5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary mt-0.5">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="ok">Source [{citation.n}]</Badge>
                {citation.page ? (
                  <span className="text-xs text-muted font-medium">Page {citation.page}</span>
                ) : null}
              </div>
              <h3 className="text-sm font-semibold text-fg mt-1 truncate" title={citation.source}>
                {citation.source}
              </h3>
              {citation.heading ? (
                <p className="text-xs text-subtle truncate mt-0.5">{citation.heading}</p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-subtle hover:text-fg hover:bg-raised transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-2xs font-semibold tracking-wider text-subtle uppercase mb-1.5">
            Exact Document Excerpt (Retrieved Passage)
          </p>
          <div className="rounded-xl bg-raised p-4 border border-border/70 max-h-64 overflow-y-auto">
            <p className="text-sm leading-relaxed text-fg select-text whitespace-pre-wrap">
              "{citation.quote}"
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-2xs text-subtle">Verified Grounded Source</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={copyQuote}
              className="h-8 text-xs"
            >
              {copied ? <Check className="size-3.5 mr-1 text-ok" /> : <Copy className="size-3.5 mr-1" />}
              Copy Excerpt
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function excerptToCitation(excerpt: Excerpt): ChatCitation {
  return {
    n: excerpt.n,
    source: excerpt.source,
    page: excerpt.page,
    heading: excerpt.heading,
    quote: excerpt.text,
  };
}
