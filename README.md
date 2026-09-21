# Personalized RAG Chatbot | [Live Web App](https://personalized-rag-chatbot.vercel.app/)

An end-to-end Retrieval-Augmented Generation (RAG) chatbot designed to deliver context-aware, personalized responses by dynamically retrieving user-specific context and relevant documents.

## 🚀 Features

- **Personalized Context Retrieval**: Dynamically fetches and incorporates user-specific memory and documents into responses.
- **Full-Stack Architecture**: Modern frontend interface paired with a fast, scalable backend framework.
- **Database Migrations & Auth**: Built-in authentication handling and database migration support.
- **Production-Ready Build**: Configured with Vite, TypeScript, Prettier, and ESLint for maintainability and quick deployments.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js / Express (Server), Python (AI/Retrieval scripts)
- **Tooling**: Prettier, ESLint

## 📁 Repository Structure

```text
├── .vercel/          # Vercel deployment configuration
├── artifacts/        # Assets and generated images
├── migrations/       # Database authentication & schema migrations
├── public/           # Static assets
├── screenshots/      # Application previews and UI screenshots
├── scripts/          # Utility and background scripts
├── server/           # Backend server logic and API routes
├── src/              # Frontend application source code
└── startup.sh        # Startup script for environment setup
