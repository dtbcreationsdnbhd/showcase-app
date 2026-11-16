/** TipTap / HTML helpers for Challenge & Solution. */

export function isRichHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/** Load existing DB text into the editor (plain text → paragraphs). */
export function toEditorHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isRichHtml(trimmed)) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = block
        .split("\n")
        .map((line) => escapeHtml(line))
        .join("<br>");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

export function plainTextFromHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
