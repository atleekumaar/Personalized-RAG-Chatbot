import { create } from "zustand";
import type { ChatMessage, ChatSession, Chunk, SourceDoc } from "@/lib/rag/types";

const SESSIONS_STORAGE_KEY = "folio_chat_sessions_v1";

function loadSavedSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Ignore storage limits
  }
}

function createInitialSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New Conversation",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
    docIds: [],
  };
}

const initialSaved = loadSavedSessions();
const currentInitial = initialSaved.length > 0 ? initialSaved[0] : createInitialSession();

type FolioState = {
  docs: SourceDoc[];
  chunks: Chunk[];
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string;
  asking: boolean;
  ingesting: boolean;
  libraryOpen: boolean;
  historyOpen: boolean;
  addDoc: (doc: SourceDoc, chunks: Chunk[]) => void;
  removeDoc: (id: string) => void;
  clearAll: () => void;
  addMessage: (message: ChatMessage) => void;
  patchMessage: (id: string, patch: Partial<ChatMessage>) => void;
  createNewSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearCurrentChat: () => void;
  setAsking: (value: boolean) => void;
  setIngesting: (value: boolean) => void;
  setLibraryOpen: (value: boolean) => void;
  setHistoryOpen: (value: boolean) => void;
};

export const useFolio = create<FolioState>((set, get) => ({
  docs: [],
  chunks: [],
  messages: currentInitial.messages,
  sessions: initialSaved.length > 0 ? initialSaved : [currentInitial],
  activeSessionId: currentInitial.id,
  asking: false,
  ingesting: false,
  libraryOpen: false,
  historyOpen: false,

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

  addMessage: (message) => {
    const state = get();
    const updatedMessages = [...state.messages, message];

    // Generate session title if it's the first user message
    let sessionTitle: string | undefined;
    if (message.role === "user" && state.messages.length === 0) {
      sessionTitle = message.content.slice(0, 36) + (message.content.length > 36 ? "…" : "");
    }

    const updatedSessions = state.sessions.map((s) => {
      if (s.id === state.activeSessionId) {
        return {
          ...s,
          title: sessionTitle || s.title,
          updatedAt: Date.now(),
          messages: updatedMessages,
          docIds: state.docs.map((d) => d.id),
        };
      }
      return s;
    });

    saveSessions(updatedSessions);
    set({ messages: updatedMessages, sessions: updatedSessions });
  },

  patchMessage: (id, patch) => {
    const state = get();
    const updatedMessages = state.messages.map((m) =>
      m.id === id ? { ...m, ...patch } : m,
    );

    const updatedSessions = state.sessions.map((s) => {
      if (s.id === state.activeSessionId) {
        return { ...s, updatedAt: Date.now(), messages: updatedMessages };
      }
      return s;
    });

    saveSessions(updatedSessions);
    set({ messages: updatedMessages, sessions: updatedSessions });
  },

  createNewSession: () => {
    const state = get();
    const newSession = createInitialSession();
    const updatedSessions = [newSession, ...state.sessions];
    saveSessions(updatedSessions);
    set({
      sessions: updatedSessions,
      activeSessionId: newSession.id,
      messages: [],
      historyOpen: false,
    });
  },

  switchSession: (sessionId) => {
    const state = get();
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;
    set({
      activeSessionId: session.id,
      messages: session.messages,
      historyOpen: false,
    });
  },

  deleteSession: (sessionId) => {
    const state = get();
    const filtered = state.sessions.filter((s) => s.id !== sessionId);
    const sessions = filtered.length > 0 ? filtered : [createInitialSession()];
    const active = sessions[0];
    saveSessions(sessions);
    set({
      sessions,
      activeSessionId: active.id,
      messages: active.messages,
    });
  },

  clearCurrentChat: () => {
    const state = get();
    const updatedSessions = state.sessions.map((s) =>
      s.id === state.activeSessionId ? { ...s, messages: [], updatedAt: Date.now() } : s,
    );
    saveSessions(updatedSessions);
    set({ messages: [], sessions: updatedSessions });
  },

  setAsking: (asking) => set({ asking }),
  setIngesting: (ingesting) => set({ ingesting }),
  setLibraryOpen: (libraryOpen) => set({ libraryOpen }),
  setHistoryOpen: (historyOpen) => set({ historyOpen }),
}));
