import { createFileRoute } from "@tanstack/react-router";
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
      className="desk-grain relative flex min-h-dvh flex-col"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight text-fg">Folio</span>
          <span className="hidden text-xs text-subtle sm:inline">
            Grounded document Q&A
          </span>
        </div>
        {docs.length > 0 ? (
          <span className="hidden text-xs text-muted md:inline">
            Answers only from your sources
          </span>
        ) : null}
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
        <Landing onUpload={openPicker} onSample={handleSample} busy={ingesting} />
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
            "pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-bg/80",
          )}
        >
          <p className="rounded-xl bg-raised px-6 py-4 font-display text-lg hairline">
            Drop PDF, Word, or Markdown to add it
          </p>
        </div>
      ) : null}
    </div>
  );
}
