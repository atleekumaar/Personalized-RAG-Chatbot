# 📄 Folio — Personalized RAG Document & Web Q&A Assistant

[![Live Web App](https://img.shields.io/badge/Live_Demo-personalized--rag--chatbot.vercel.app-blue?style=for-the-badge&logo=vercel)](https://personalized-rag-chatbot.vercel.app/)
[![Author](https://img.shields.io/badge/Author-Atlee_Kumaar-purple?style=for-the-badge)](https://github.com/atleekumaar)
[![Powered by Groq](https://img.shields.io/badge/LLM_Engine-Groq_AI-orange?style=for-the-badge)](https://groq.com/)

An end-to-end, high-performance **Personalized Retrieval-Augmented Generation (RAG)** chatbot designed to answer questions strictly grounded in your uploaded documents and web articles with zero hallucination.

---

## 🌟 Key Features

### 1. ⚡ Real-Time Streaming Answers (Typewriter Effect)
- Ultra-low latency responses powered by **Groq API** (`openai/gpt-oss-120b`).
- Instant streaming output revealing tokens in real time.

### 2. 🎙️ Voice Input (STT) & Speech Playback (TTS)
- **Speech-to-Text (STT):** Ask questions by speaking into your microphone via Web Speech API.
- **Text-to-Speech (TTS):** One-click audio read-out button on any generated answer.

### 3. 📑 Multi-Format Document & Web URL Ingestion
- **PDF Documents:** Page-by-page client extraction with `pdfjs-dist`.
- **Word Files (.docx):** Browser-safe XML paragraph extraction with `jszip`.
- **Markdown (.md) & Plain Text (.txt):** Direct text chunking with sliding-window overlap.
- **Live Webpage Scraping:** Import any public article/documentation URL directly into your knowledge base.

### 4. 💬 Chat History & One-Click Export
- **Multiple Saved Sessions:** Automatically persist conversations in `localStorage` across page reloads.
- **Export Options:** Download the entire Q&A transcript with citations in **Markdown (.md)** or print to **PDF**.

### 5. ☀️ / 🌙 Light & Dark Theme Toggle
- Dynamic theme switcher with obsidian dark glassmorphism and clean light mode palettes.

### 6. 🔒 100% Grounded Q&A with Inline Citations
- Strict refusal when content is not found in documents.
- Inline numbered references (`[1]`, `[2]`) with interactive verified quotes accordion.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework & Routing** | [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), React 19, TypeScript |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Lucide Icons, Sonner Toasts |
| **LLM Inference** | [Groq Cloud API](https://console.groq.com/) (`openai/gpt-oss-120b`) |
| **Document Parsers** | `pdfjs-dist`, `jszip` (Browser DOCX parser) |
| **Voice & Audio** | Browser-native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **State & Persistence** | [Zustand](https://github.com/pmndrs/zustand) with LocalStorage Sync |

---

## 🏗️ Architecture & RAG Pipeline

```text
[ Document / URL Ingestion ] 
        │ (PDF, DOCX, MD, TXT, Web URL)
        ▼
[ Client-Side Tokenizer & Chunker ] 
        │ (Sliding-window BM25 retrieval)
        ▼
[ Context Assembler & Grounding Prompter ]
        │ (Strict rule injection + Top-K excerpts)
        ▼
[ Groq API Inference ] (openai/gpt-oss-120b)
        │ (Fast Token-by-Token Streaming)
        ▼
[ Interactive UI with Audio & Citations ]
```

---

## ⚙️ Environment Variables

To run the application locally or deploy on Vercel, set the following environment variable:

```env
GROQ_API_KEY=your_groq_api_key_here
```
*(Also supports `VyaparMitra2` and `XAI_API_KEY` for backwards compatibility)*

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/atleekumaar/Personalized-RAG-Chatbot.git
cd Personalized-RAG-Chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=gsk_your_groq_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 👨‍💻 Author

**Atlee Kumaar**
- GitHub: [@atleekumaar](https://github.com/atleekumaar)
- Project: [Personalized RAG Chatbot](https://github.com/atleekumaar/Personalized-RAG-Chatbot)
- Live Web App: [personalized-rag-chatbot.vercel.app](https://personalized-rag-chatbot.vercel.app/)

---

## 📄 License

This project is licensed under the MIT License.
