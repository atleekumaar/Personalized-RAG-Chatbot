import { BookOpen, FileUp, Globe, Loader2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchWebpage } from "@/lib/rag/fetch-url";
import { ingestUrlContent } from "@/lib/rag/ingest";
import type { Chunk, SourceDoc } from "@/lib/rag/types";

type LandingProps = {
  onUpload: () => void;
  onSample: () => void;
  onAddDoc?: (doc: SourceDoc, chunks: Chunk[]) => void;
  busy: boolean;
};

export function Landing({ onUpload, onSample, onAddDoc, busy }: LandingProps) {
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);

  async function handleUrlSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed || !onAddDoc) return;

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
    <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-12 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Personalized Document & URL Q&A
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-medium tracking-tight text-fg sm:text-5xl">
            Ask only what your sources can prove.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Upload PDF, Word (DOCX), Markdown, Text files, or import live Web URLs.
            Folio retrieves matching excerpts and streams voice & text answers
            grounded strictly in your documents.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <Button
              type="button"
              size="lg"
              onClick={onUpload}
              disabled={busy}
              className="min-h-12 w-full sm:w-auto"
            >
              <FileUp className="size-4 mr-2" />
              Upload Document (PDF, Word, Text)
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setUrlModalOpen(true)}
              disabled={busy}
              className="min-h-12 w-full sm:w-auto"
            >
              <Globe className="size-4 mr-2" />
              Import Web URL
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onSample}
              disabled={busy}
              className="min-h-12 w-full sm:w-auto"
            >
              <BookOpen className="size-4 mr-2" />
              Load sample manual
            </Button>
          </div>

          {urlModalOpen ? (
            <form onSubmit={handleUrlSubmit} className="mt-4 rounded-xl bg-raised p-4 hairline max-w-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-fg">Enter Webpage / Article URL</span>
                <button
                  type="button"
                  onClick={() => setUrlModalOpen(false)}
                  className="text-subtle hover:text-fg"
                >
                  <X className="size-4" />
                </button>
              </div>
              <input
                type="url"
                required
                placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="mt-2.5 w-full rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUrlModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={fetchingUrl || !urlInput.trim()}
                  className="h-8 text-xs"
                >
                  {fetchingUrl ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      Importing…
                    </>
                  ) : (
                    "Import Webpage"
                  )}
                </Button>
              </div>
            </form>
          ) : null}

          <p className="mt-5 text-xs leading-relaxed text-subtle">
            Strict grounding. No hallucination. Voice & streaming enabled. Drop any PDF, Word, or Markdown file anywhere on this page.
          </p>
        </div>

        <PaperStack />
      </div>
    </section>
  );
}

function PaperStack() {
  return (
    <div className="relative mx-auto hidden h-80 w-full max-w-md lg:block" aria-hidden="true">
      <div className="absolute inset-x-10 top-10 h-64 -rotate-6 rounded-xl bg-raised hairline" />
      <div className="absolute inset-x-6 top-6 h-64 rotate-3 rounded-xl bg-surface hairline" />
      <div className="absolute inset-x-2 top-2 flex h-64 flex-col rounded-xl bg-raised p-6 hairline">
        <div className="flex items-center justify-between text-2xs tracking-widest text-subtle uppercase">
          <span>Supported Formats</span>
          <span>PDF · DOCX · URL · TXT</span>
        </div>
        <div className="mt-5 space-y-2.5">
          <div className="h-2 w-4/5 rounded-full bg-fg/20" />
          <div className="h-2 w-full rounded-full bg-fg/10" />
          <div className="h-2 w-5/6 rounded-full bg-fg/10" />
          <div className="h-2 w-2/3 rounded-full bg-fg/10" />
        </div>
        <div className="mt-6 rounded-md bg-bg/60 px-3 py-3">
          <p className="font-display text-sm leading-relaxed text-fg/90">
            “Grounded Q&A with live citations, voice dictation, and real-time streaming.”
          </p>
        </div>
        <p className="mt-auto text-2xs text-subtle">Personalized RAG Engine</p>
      </div>
    </div>
  );
}
