# Design system

This is the one place for the website's styling rules. The styles that carry
them out live in [`src/index.css`](src/index.css): shared classes under
`@layer components`, element defaults under `@layer base`, and the font import
at the top. [`tailwind.config.js`](tailwind.config.js) sets the font families.

Rules are decisions the author has made. Current values record how the site is
built today. Known exceptions list what doesn't follow the rules yet.

## Rules

### Sitewide

- Geist is the typeface for everything. Text uses Geist; code uses Geist
  Mono. Math formulas keep their own math fonts.
- Semibold is banned. Don't use `font-semibold`, `font-weight: 600`, or
  semibold font files. When emphasis needs weight, use medium (500) or bold
  (700).
- All-caps section titles are banned. Don't use `uppercase`,
  `text-transform: uppercase`, or text typed in all caps for section titles or
  headings.
- Section titles are slate-950, medium weight, and slightly larger than the
  body text around them. On the homepage, use `.section-title`.
- The homepage title is one heading, "Delta: A DSL for enlivening typeset
  formulas with interactive explanations", in Geist at the same weight as the
  section titles (500). Don't split "Delta" from the rest of the title.
- Shared styling goes in a class in `src/index.css`, not in one-off Tailwind
  text, color, or weight utilities in components.
- Small text gets wider letter spacing so it stays readable: 0.025em at 13px
  and 14px, 0.03em at 12px and below. Code keeps normal spacing. Tailwind's
  `text-xs` and `text-sm` include it (`tailwind.config.js`); classes with a
  custom small size add it with `tracking-[…]`.

### Docs page

- **Size.** All text except headings, captions, and code is 15px. Captions
  are 13px, and code is 14px.
- **Weight.** All text except headings is 400. Headings, including table
  headers, are 500.
- **Color.** Text uses only two colors: slate-950 (`#020617`) and slate-600
  (`#475569`).
  - slate-950: headings, prose (paragraphs and list text), sidebar items (nav
    items and footer links), inline code, table headers and cells.
  - slate-600: captions, list bullets.
- **Code lines.** Code in code blocks and snippet editors has a 20px line
  height. Inline code in prose is exempt.
- **Live example sizes.** Every example config in `src/tutorial-examples/`
  sets `fontSize: 2.5` for the formula and `labelFontSize: 1.5` for its
  labels.
- **Prose width.** Prose (paragraphs and lists) is at most 720px wide.
- **Code block width.** Code blocks are at most 720px wide.
- **Quick start preview width.** The Quick start's live preview is at most
  720px wide.
- **Alignment.** Everything is left-aligned to the content column's left
  edge. Don't center prose, headings, or code blocks.
- **Corners.** Code containers (code blocks and the snippet playground),
  tables, example images, and live example previews have 4px corners. The
  copy and scroll buttons on a code box have 2px corners.
- **Scrolling.** The mouse wheel always scrolls the page, even over code
  boxes and live example previews. Code boxes never scroll with the wheel;
  when code is taller than its box, up and down buttons at the box's
  bottom-right scroll it.
- **Dividers.** Horizontal dividers only separate the page's parts
  (Overview, Quick start, Language reference). Inside a part, space alone
  separates sections and reference groups. Dividers are at most 720px wide.
- **Sidebar nav.** The nav is flat, with no nesting or indentation. Captions
  name each group of items. Items sit 1px apart and have 4px corners.

## Current values

### Typography

Geist (400, 500, 700) and Geist Mono (400) load from Google Fonts at the top
of `src/index.css`. The `delta-dsl` stylesheet sets Inter Tight on `html`,
`body`, and `#root`; a base rule in `src/index.css` resets those to Geist, so
keep `index.css` imported after `delta-dsl/style.css` in `src/main.tsx`.

Headings (all weight 500, slate-950):

| Element | Class | Size / line height | Tracking |
|---|---|---|---|
| Page title (h2) | `.docs-page-header h2` | 34px (36px at 640px and up) / 1.1 | tight |
| Reference group title (h3) | `.construct-group-heading h3` | 30px / 36px | tight |
| Section title (h3) | `.docs-section h3` | 24px / 32px | tight |
| Homepage title (h1) | `.home-title` | 20px (24px at 640px and up) / 1.375 | tight |
| Homepage section title | `.section-title` | 24px / 32px | tight |
| Reference entry title (h4) | `.construct-item h4` | 20px / 28px | normal |
| Table title (h4) | `.docs-table-heading` | 18px / 28px | normal |
| Table header | `.table-wrap th` | 15px / 20px | normal |

Text (all weight 400). Prose classes, `.code-block-shell`, the part
dividers, and the Quick start's live preview (`.docs-example-preview`) cap
their width with `max-w-[720px]` and sit at the column's left edge. Tables and
snippet playgrounds span the full article column, up to 1024px
(`.docs-article`).

| Element | Class | Size / line height | Color |
|---|---|---|---|
| Page intro | `.docs-page-intro` | 15px / 28px | slate-950 |
| Section prose | `.docs-section > p`, `.construct-group-heading > p` | 15px / 28px | slate-950 |
| Reference entry prose | `.construct-description` | 15px / 28px | slate-950 |
| Lists | `.docs-list` | 15px / 28px | slate-950, bullets slate-600, `<strong>` slate-950 |
| Prose link | `.docs-link` | Same as the prose around it | slate-950, slate-300 underline (slate-950 on hover) |
| Table cells | `.table-wrap td` | 15px / 24px | slate-950 |
| Inline code | `.inline-code code` | 14px Geist Mono | slate-950 |
| Code block | `.code-block` | 14px Geist Mono / 20px, at most 720px wide and 544px tall, then scrolls | slate-800 (see Known exceptions) |
| Full-length code block (Quick start hello world) | `.code-block-full` | 14px Geist Mono / 20px, at most 720px wide, full height, no scrolling | slate-800 (see Known exceptions) |
| Snippet editor (Language reference) | `.protected-code-content` | 14px Geist Mono / 20px; the editable region is 20px per line | slate-700 and slate-800 (see Known exceptions) |
| Nav caption | `.docs-nav-caption` | 13px / 20px, 0.025em letter spacing | slate-600 |
| Nav item | `.docs-nav-link` | 15px / 21px | slate-950 |
| Sidebar footer link | `.docs-sidebar-footer-link` | 15px / 20px | slate-950 |

### Sidebar nav

- Structure: each `.docs-nav-group` is a `.docs-nav-caption` followed by a
  `.docs-nav-list` of `.docs-nav-link` items. Groups are 24px apart.
- Item: 4px vertical and 8px horizontal padding, 4px radius, 1px gap between
  items.
- Hover: slate-50 background.
- Active: slate-100 background. The text stays slate-950 at weight 400, so
  the background alone marks the active item.

### Scrolling

- `.code-block` and `.protected-code` (the snippet editor) use
  `overflow-y-hidden`, so the wheel passes over them to the page. They still
  scroll sideways for long lines.
- `ScrollControls` (`src/components/ScrollControls.tsx`) adds the up and down
  `.code-icon-button`s in `.code-scroll-controls` when a box's code is taller
  than the box. Each click scrolls three quarters of the box's height, and a
  button disables at the end it points to.
- `DeltaPreview` stops wheel events in the capture phase, before the
  `delta-dsl` formula canvas can cancel them.

### Spacing

| Gap | Size | Class |
|---|---|---|
| Before each section, after the content above it | 24px | `.docs-section` (`pt-6`) |
| Between paragraphs in a page intro or reference entry | 16px | `.docs-page-intro`, `.construct-description` (`space-y-4`) |
| Before each reference group | 32px | `.construct-group` (`pt-8`) |
| Last content of a part to the divider | 48px | `.docs-part:not(:last-child)::after` (`mt-12`) |
| Divider to the next part's title | 80px | `.docs-part + .docs-part` (`mt-20`) |

Live example previews are 250px tall, or 300px for the first example and the
walkthroughs, set per example with `formulaHeight` in
`src/tutorial-examples/index.ts`.

### Surfaces and lines

| Use | Color |
|---|---|
| Borders and dividers | slate-200 |
| Active nav item, inline code background | slate-100 |
| Nav hover, table header background, code block background | slate-50 |

### Corner radii

| Element | Radius |
|---|---|
| Nav items | 4px |
| Code blocks, snippet playground (editor and preview as one box), tables | 4px |
| Live example preview (`DeltaPreview`) | 4px |
| Code copy and scroll buttons (`.code-icon-button`) | 2px |
| Inline code chips | 6px |
| Logo mark, sidebar toggle buttons | 8px |
| Zoomed image in the lightbox (`.lightbox-image`), demo video in its modal (`.video-modal-player`) | 12px |
| Homepage image (`.zoomable-thumbnail` outside the docs) | 16px |

## Known exceptions

These don't follow the rules above yet, or are deliberately outside them.

- List lead-ins in `<strong>` (such as "Calculators.") are slate-950 at
  weight 400, the same as the list text, so they no longer stand out.
- Code blocks and editable snippets use slate-800 and slate-700 text with
  syntax-highlight colors.
- The "Copy" tooltip on inline code is 11px white text on slate-950, with
  0.03em letter spacing.
- Snippet error messages are red (`.snippet-error` 15px red-800;
  `DeltaPreview` errors 14px red-700).
- The sidebar wordmark "Documentation" is 16px, weight 500.
- The sidebar hide/show toggle icon is slate-500. The toggle is switched off
  (`sidebarCollapseEnabled` in `src/Docs.tsx`).
- The homepage hasn't been brought in line with the docs page rules. Its
  default text is slate-900, the hero paragraph is 16px slate-700, resource
  links are 16px blue-600, pending links are slate-400, and the "soon" pill is
  12px slate-500. The docs loading fallback in `src/App.tsx` is slate-500.
