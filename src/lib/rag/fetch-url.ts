import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  url: z.string().url(),
});

function cleanHtml(html: string): { title: string; text: string } {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "Web Article";

  // Remove script, style, nav, footer, header, svg, noscript tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");

  // Convert headings and paragraphs to structured markdown
  cleaned = cleaned
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n### $1\n\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n\n$1\n\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n* $1")
    .replace(/<br\s*\/?>/gi, "\n");

  // Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\n\s+\n/g, "\n\n")
    .trim();

  return { title, text: cleaned };
}

export const fetchWebpage = createServerFn({ method: "POST" })
  .validator((data) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; title: string; text: string } | { ok: false; error: string }> => {
    try {
      const parsed = new URL(data.url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { ok: false, error: "Only HTTP and HTTPS URLs are supported." };
      }

      const res = await fetch(data.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!res.ok) {
        return { ok: false, error: `Failed to fetch URL (${res.status} ${res.statusText})` };
      }

      const html = await res.text();
      const { title, text } = cleanHtml(html);

      if (text.length < 50) {
        return { ok: false, error: "Could not extract readable text from that webpage." };
      }

      return { ok: true, title, text };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch webpage.",
      };
    }
  });
