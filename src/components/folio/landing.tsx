import { FileUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type LandingProps = {
  onUpload: () => void;
  onSample: () => void;
  busy: boolean;
};

export function Landing({ onUpload, onSample, busy }: LandingProps) {
  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-12 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Document Q&A
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-medium tracking-tight text-fg sm:text-5xl">
            Ask only what the page can prove.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Upload a PDF or Markdown file. Folio retrieves the relevant
            passages and answers from those pages alone — with citations. If it
            is not in your documents, Folio says so.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              onClick={onUpload}
              disabled={busy}
              className="min-h-12 w-full sm:w-auto"
            >
              <FileUp className="size-4" />
              Upload PDF or Markdown
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onSample}
              disabled={busy}
              className="min-h-12 w-full sm:w-auto"
            >
              <BookOpen className="size-4" />
              Load sample manual
            </Button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-subtle">
            Strict grounding. No web search. No outside knowledge. Drop a file
            anywhere on this page.
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
          <span>NTA Winter Manual</span>
          <span>p. 4</span>
        </div>
        <div className="mt-5 space-y-2.5">
          <div className="h-2 w-4/5 rounded-full bg-fg/20" />
          <div className="h-2 w-full rounded-full bg-fg/10" />
          <div className="h-2 w-5/6 rounded-full bg-fg/10" />
          <div className="h-2 w-2/3 rounded-full bg-fg/10" />
        </div>
        <div className="mt-6 rounded-md bg-bg/60 px-3 py-3">
          <p className="font-display text-sm leading-relaxed text-fg/90">
            “Winter operations lead: Mara Ellison, extension 4412.”
          </p>
        </div>
        <p className="mt-auto text-2xs text-subtle">Grounded excerpt</p>
      </div>
    </div>
  );
}
