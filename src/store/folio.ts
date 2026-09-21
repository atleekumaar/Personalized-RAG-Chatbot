import { create } from "zustand";
import type { ChatMessage, Chunk, SourceDoc } from "@/lib/rag/types";

type FolioState = {
  docs: SourceDoc[];
  chunks: Chunk[];
  messages: ChatMessage[];
  asking: boolean;
  ingesting: boolean;
  libraryOpen: boolean;
  addDoc: (doc: SourceDoc, chunks: Chunk[]) => void;
  removeDoc: (id: string) => void;
  clearAll: () => void;
  addMessage: (message: ChatMessage) => void;
  patchMessage: (id: string, patch: Partial<ChatMessage>) => void;
  setAsking: (value: boolean) => void;
  setIngesting: (value: boolean) => void;
  setLibraryOpen: (value: boolean) => void;
};

export const useFolio = create<FolioState>((set) => ({
  docs: [],
  chunks: [],
  messages: [],
  asking: false,
  ingesting: false,
  libraryOpen: false,
  addDoc: (doc, chunks) =>
    set((state) => ({
      docs: [...state.docs, doc],
      chunks: [...state.chunks, ...chunks],
    })),
  removeDoc: (id) =>
    set((state) => {
      const docs = state.docs.filter((d) => d.id !== id);
      return {
        docs,
        chunks: state.chunks.filter((c) => c.docId !== id),
        messages: docs.length === 0 ? [] : state.messages,
        libraryOpen: docs.length === 0 ? false : state.libraryOpen,
      };
    }),
  clearAll: () =>
    set({
      docs: [],
      chunks: [],
      messages: [],
      asking: false,
      ingesting: false,
      libraryOpen: false,
    }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  patchMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...patch } : m,
      ),
    })),
  setAsking: (asking) => set({ asking }),
  setIngesting: (ingesting) => set({ ingesting }),
  setLibraryOpen: (libraryOpen) => set({ libraryOpen }),
}));
