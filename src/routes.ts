// Each page has a real path under the site's base path ("/delta/"). The
// homepage is the base itself. The docs are one long page whose three parts
// each have a path, such as "docs/quick-start", and a "#" names a section, as
// in "docs/language-reference#step-constructs".
export const docsParts = ["overview", "quick-start", "language-reference"];

// GitHub Pages only serves files that exist, so the build copies the page to
// each docs path (see vite.config.ts). It serves "docs/quick-start.html" at
// "docs/quick-start", and "docs/index.html" at "docs/".
export const docsPageFiles = [
  "docs/index.html",
  ...docsParts.map((part) => `docs/${part}.html`),
];

export function docsUrl(part: string, section?: string) {
  return `${import.meta.env.BASE_URL}docs/${part}${section ? `#${section}` : ""}`;
}

// The docs part named in the path, or null on the homepage. "docs/" alone is
// the overview.
export function getDocsPart(): string | null {
  const base = import.meta.env.BASE_URL;
  const { pathname } = window.location;
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  const [page, part] = path.replace(/(\.html|\/)$/, "").split("/");
  if (page !== "docs") return null;
  return part && part !== "index" ? part : "overview";
}

// Older names: Installation and Config setup became the quick start,
// Constructs became the language reference, and two reference groups were
// renamed.
const legacyIds: Record<string, string> = {
  installation: "quick-start",
  config: "quick-start",
  constructs: "language-reference",
  "formula-constructs": "variable-constructs",
  "computation-constructs": "value-constructs",
};

// Before the pages had real paths, they lived after a "#", as in
// "#/getting-started/quick-start", with "?section=" naming a section. Move
// such an address to its real path so old links keep working.
export function redirectHashAddress() {
  const { hash } = window.location;
  if (!hash.startsWith("#/")) return;

  const [path, query] = hash.slice(1).split("?");
  let url = import.meta.env.BASE_URL;
  if (path === "/getting-started" || path.startsWith("/getting-started/")) {
    const named = path.split("/")[2] || "overview";
    const part = legacyIds[named] ?? named;
    const section = new URLSearchParams(query).get("section");
    url = docsUrl(
      docsParts.includes(part) ? part : "overview",
      section ? (legacyIds[section] ?? section) : undefined,
    );
  }
  window.history.replaceState(null, "", url);
}
