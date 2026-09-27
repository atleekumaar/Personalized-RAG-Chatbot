export type DocKind = "pdf" | "markdown" | "text" | "sample" | "docx" | "url";

export type SourcePage = {
  page: number | null;
  heading: string | null;
  text: string;
};

export type SourceDoc = {
  id: string;
  name: string;
  kind: DocKind;
  pageCount: number;
  charCount: number;
  addedAt: number;
};

export type Chunk = {
  id: string;
  docId: string;
  source: string;
  page: number | null;
  heading: string | null;
  text: string;
};

export type Excerpt = {
  n: number;
  source: string;
  page: number | null;
  heading: string | null;
  text: string;
};

export type ChatCitation = {
  n: number;
  source: string;
  page: number | null;
  heading: string | null;
  quote: string;
};

export type AnswerMode = "model" | "passages";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  found?: boolean;
  mode?: AnswerMode;
  citations?: ChatCitation[];
  error?: string;
};

export type AskResult =
  | {
      ok: true;
      found: boolean;
      answer: string;
      used: number[];
      mode: AnswerMode;
    }
  | {
      ok: false;
      error: string;
    };

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  docIds: string[];
};
