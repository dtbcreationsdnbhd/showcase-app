import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

export function isRichHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function sanitizeProjectHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
