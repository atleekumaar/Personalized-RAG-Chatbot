import type { ChatMessage, SourceDoc } from "./types";

export function exportChatToMarkdown(
  messages: ChatMessage[],
  docs: SourceDoc[],
  title = "Chat History",
): void {
  const dateStr = new Date().toLocaleString();
  const sourceNames = docs.map((d) => d.name).join(", ") || "None";

  let md = `# 📄 Folio Q&A Export - ${title}\n`;
  md += `*Exported on: ${dateStr}*\n`;
  md += `*Sources: ${sourceNames}*\n\n---\n\n`;

  for (const msg of messages) {
    if (msg.role === "user") {
      md += `### 👤 User:\n${msg.content}\n\n`;
    } else {
      md += `### 🤖 Folio Assistant:\n${msg.content}\n\n`;
      if (msg.citations && msg.citations.length > 0) {
        md += `**Sources cited:**\n`;
        for (const c of msg.citations) {
          const loc = [c.source, c.page ? `p. ${c.page}` : null, c.heading]
            .filter(Boolean)
            .join(" · ");
          md += `- **[${c.n}]** ${loc}: _"${c.quote}"_\n`;
        }
        md += `\n`;
      }
      md += `---\n\n`;
    }
  }

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `folio-chat-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printChatToPdf(): void {
  window.print();
}
