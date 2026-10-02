import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Landing } from "@/components/folio/landing";
import { Workspace } from "@/components/folio/workspace";
import { ingestFile, ingestSample, MAX_DOCS } from "@/lib/rag/ingest";
import { cn } from "@/lib/utils";
import { useFolio } from "@/store/folio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const docs = useFolio((s) => s.docs);
  const ingesting = useFolio((s) => s.ingesting);
  const libraryOpen = useFolio((s) => s.libraryOpen);
  const addDoc = useFolio((s) => s.addDoc);
  const removeDoc = useFolio((s) => s.removeDoc);
  const clearAll = useFolio((s) => s.clearAll);
  const setIngesting = useFolio((s) => s.setIngesting);
  const setLibraryOpen = useFolio((s) => s.setLibraryOpen);
  const [dragging, setDragging] = useState(false);

  function openPicker() {
    fileRef.current?.click();
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const remaining = MAX_DOCS - useFolio.getState().docs.length;
    if (remaining <= 0) {
      toast.error("You can keep up to 8 documents in the library.");
      return;
    }
    const files = [...fileList].slice(0, remaining);
    setIngesting(true);
    try {
      for (const file of files) {
        const { doc, chunks } = await ingestFile(file);
        addDoc(doc, chunks);
        toast.success(`Added ${doc.name}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that file.");
    } finally {
      setIngesting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSample() {
    if (useFolio.getState().docs.length >= MAX_DOCS) {
      toast.error("You can keep up to 8 documents in the library.");
      return;
    }
    if (useFolio.getState().docs.some((d) => d.kind === "sample")) return;
    const { doc, chunks } = ingestSample();
    addDoc(doc, chunks);
    toast.success("Sample winter operations manual added.");
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    setDragging(true);
  }

  function onDragLeave(event: DragEvent) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setDragging(false);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void handleFiles(event.dataTransfer.files);
  }

  return (
    <div
      className="desk-grain relative flex h-dvh flex-col bg-bg text-fg overflow-hidden"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-sm">
            F
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-fg">Folio</span>
            <span className="hidden text-2xs text-muted sm:inline font-mono tracking-wide uppercase">
              RAG AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {docs.length > 0 ? (
            <span className="hidden text-xs text-muted md:inline">
              Grounded on <span className="font-medium text-fg">{docs.length} source{docs.length > 1 ? "s" : ""}</span>
            </span>
          ) : null}

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Single Header Watermark Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-raised/80 px-3 py-1 text-2xs text-muted shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-ok animate-pulse" />
            <span>by <strong className="text-fg font-medium">Atlee Kumaar</strong></span>
          </div>
        </div>
      </header>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,.md,.markdown,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {docs.length === 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <Landing
            onUpload={openPicker}
            onSample={handleSample}
            onAddDoc={addDoc}
            busy={ingesting}
          />
        </div>
      ) : (
        <Workspace
          docs={docs}
          ingesting={ingesting}
          libraryOpen={libraryOpen}
          onUpload={openPicker}
          onSample={handleSample}
          onAddDoc={addDoc}
          onRemove={removeDoc}
          onClear={clearAll}
          onOpenLibrary={setLibraryOpen}
        />
      )}

      {dragging ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-bg/85 backdrop-blur-sm",
          )}
        >
          <div className="rounded-2xl border border-primary/40 bg-raised p-8 text-center shadow-2xl">
            <p className="font-display text-xl font-medium text-fg">
              Drop files to add to library
            </p>
            <p className="mt-2 text-xs text-muted">Supports PDF, Word (DOCX), Markdown, and TXT</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
