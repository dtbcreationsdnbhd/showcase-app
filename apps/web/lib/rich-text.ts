const ALLOWED_TAGS = new Set([
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
]);

const VOID_TAGS = new Set(["br"]);

/** Opening these drops the element and everything until its close tag. */
const DROP_CONTENT_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "textarea",
  "svg",
  "math",
  "template",
]);

const SAFE_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);
const SAFE_TARGETS = new Set(["_blank", "_self", "_parent", "_top"]);
const SAFE_REL = new Set([
  "noopener",
  "noreferrer",
  "nofollow",
  "ugc",
  "external",
]);

type Attr = { name: string; value: string | null };

type ReadTag =
  | { kind: "skip"; end: number }
  | { kind: "drop"; end: number; name: string }
  | { kind: "tag"; end: number; name: string; closing: boolean; attrs: Attr[] };

export function isRichHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/**
 * Allowlist filter for project copy. Runs during server render, so it must
 * not pull in jsdom: that package's ESM dependency crashes the Vercel runtime
 * with ERR_REQUIRE_ESM and turns the page into a 500.
 */
export function sanitizeProjectHtml(html: string): string {
  let index = 0;
  let out = "";

  while (index < html.length) {
    const lt = html.indexOf("<", index);
    if (lt === -1) {
      out += html.slice(index);
      break;
    }

    out += html.slice(index, lt);
    const tag = readTag(html, lt);
    if (!tag) {
      out += "&lt;";
      index = lt + 1;
      continue;
    }

    index = tag.end;
    if (tag.kind === "skip") continue;
    if (tag.kind === "drop") {
      index = skipElement(html, tag.end, tag.name);
      continue;
    }
    if (tag.closing) {
      if (ALLOWED_TAGS.has(tag.name) && !VOID_TAGS.has(tag.name)) {
        out += `</${tag.name}>`;
      }
      continue;
    }
    if (!ALLOWED_TAGS.has(tag.name)) continue;

    if (VOID_TAGS.has(tag.name)) {
      out += `<${tag.name}>`;
      continue;
    }
    out += `<${tag.name}${serializeAttrs(tag.name, tag.attrs)}>`;
  }

  return out;
}

function readTag(html: string, start: number): ReadTag | null {
  if (html.startsWith("<!--", start)) {
    const end = html.indexOf("-->", start + 4);
    return { kind: "skip", end: end === -1 ? html.length : end + 3 };
  }
  if (
    html.startsWith("<!", start) ||
    html.startsWith("<?", start) ||
    html.startsWith("<![", start)
  ) {
    const end = html.indexOf(">", start + 2);
    return end === -1 ? null : { kind: "skip", end: end + 1 };
  }

  let index = start + 1;
  let closing = false;
  if (html[index] === "/") {
    closing = true;
    index += 1;
  }

  const nameStart = index;
  while (index < html.length && /[A-Za-z0-9]/.test(html[index])) index += 1;
  if (index === nameStart) return null;
  if (
    index < html.length &&
    (html[index] === ":" || (html[index] === "/" && html[index + 1] !== ">"))
  ) {
    return null;
  }

  const name = html.slice(nameStart, index).toLowerCase();
  if (closing) {
    while (index < html.length && html[index] !== ">") index += 1;
    if (index >= html.length) return null;
    return { kind: "tag", end: index + 1, name, closing: true, attrs: [] };
  }

  const attrs: Attr[] = [];
  let closed = false;
  while (index < html.length) {
    while (index < html.length && /\s/.test(html[index])) index += 1;
    if (index >= html.length) return null;
    if (html[index] === ">") {
      index += 1;
      closed = true;
      break;
    }
    if (html[index] === "/" && html[index + 1] === ">") {
      index += 2;
      closed = true;
      break;
    }

    const attrStart = index;
    while (index < html.length && /[A-Za-z0-9_:\-.]/.test(html[index])) {
      index += 1;
    }
    if (index === attrStart) {
      index += 1;
      continue;
    }
    const attrName = html.slice(attrStart, index).toLowerCase();
    while (index < html.length && /\s/.test(html[index])) index += 1;
    if (html[index] !== "=") {
      attrs.push({ name: attrName, value: null });
      continue;
    }
    index += 1;
    while (index < html.length && /\s/.test(html[index])) index += 1;

    let value = "";
    const quote = html[index];
    if (quote === '"' || quote === "'") {
      index += 1;
      const valueStart = index;
      while (index < html.length && html[index] !== quote) index += 1;
      value = html.slice(valueStart, index);
      if (html[index] === quote) index += 1;
    } else {
      const valueStart = index;
      while (
        index < html.length &&
        !/\s/.test(html[index]) &&
        html[index] !== ">" &&
        html[index] !== "/"
      ) {
        index += 1;
      }
      value = html.slice(valueStart, index);
    }
    attrs.push({ name: attrName, value });
  }

  if (!closed) return null;
  if (DROP_CONTENT_TAGS.has(name)) {
    return { kind: "drop", end: index, name };
  }
  return { kind: "tag", end: index, name, closing: false, attrs };
}

function skipElement(html: string, from: number, name: string): number {
  let depth = 1;
  let index = from;

  while (index < html.length && depth > 0) {
    const lt = html.indexOf("<", index);
    if (lt === -1) return html.length;
    const tag = readTag(html, lt);
    if (!tag) {
      index = lt + 1;
      continue;
    }
    if (
      (tag.kind === "tag" || tag.kind === "drop") &&
      tag.name === name &&
      (tag.kind === "drop" || !tag.closing)
    ) {
      depth += 1;
    } else if (tag.kind === "tag" && tag.closing && tag.name === name) {
      depth -= 1;
    }
    index = tag.end;
  }

  return index;
}

function serializeAttrs(tag: string, attrs: readonly Attr[]): string {
  if (tag !== "a") return "";

  let href: string | null = null;
  let target: string | null = null;
  let rel: string | null = null;

  for (const attr of attrs) {
    if (attr.value == null) continue;
    if (attr.name === "href" && href === null) {
      href = safeHref(attr.value);
    } else if (attr.name === "target" && target === null) {
      const value = decodeEntities(attr.value).trim().toLowerCase();
      if (SAFE_TARGETS.has(value)) target = value;
    } else if (attr.name === "rel" && rel === null) {
      const tokens = decodeEntities(attr.value)
        .split(/\s+/)
        .map((token) => token.toLowerCase())
        .filter((token) => SAFE_REL.has(token));
      if (tokens.length > 0) rel = [...new Set(tokens)].join(" ");
    }
  }

  let out = "";
  if (href) out += ` href="${escapeAttr(href)}"`;
  if (target) out += ` target="${target}"`;
  if (rel) out += ` rel="${escapeAttr(rel)}"`;
  return out;
}

function safeHref(raw: string): string | null {
  const decoded = decodeEntities(raw)
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
  if (!decoded) return null;

  const compact = decoded.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
  if (
    compact.startsWith("javascript:") ||
    compact.startsWith("data:") ||
    compact.startsWith("vbscript:")
  ) {
    return null;
  }

  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(compact);
  if (scheme && !SAFE_SCHEMES.has(`${scheme[1]}:`)) return null;
  return decoded;
}

function decodeEntities(value: string): string {
  let current = value;
  for (let pass = 0; pass < 3; pass += 1) {
    const next = current
      .replace(/&#x([0-9a-f]+);?/gi, (_, hex: string) =>
        fromCodePoint(Number.parseInt(hex, 16)),
      )
      .replace(/&#(\d+);?/g, (_, dec: string) =>
        fromCodePoint(Number.parseInt(dec, 10)),
      )
      .replace(/&colon;/gi, ":")
      .replace(/&tab;/gi, "\t")
      .replace(/&newline;/gi, "\n")
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&");
    if (next === current) break;
    current = next;
  }
  return current;
}

function fromCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
