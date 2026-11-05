# Delta website

A small Vite, React, and Tailwind website for the Delta paper. The live examples
use the real `Provider`, `Formula`, and `StepControl` components from the sibling
[`formula-editor`](../formula-editor) repository.

## Run locally

Build the local Delta package once:

```bash
cd ../formula-editor
npm install
npm run build
```

Then start this website:

```bash
cd ../delta-website
npm install
npm run dev
```

The site opens at `http://localhost:5173/delta/`, under the same base path as
the deployed site. The full Formula Editor playground runs separately at
`http://localhost:3005`.

## Pages and addresses

The site is served from `https://www.pennhci.com/delta/`, so `vite.config.ts`
sets the base path to `/delta/`. Each page has a real path: the homepage is
`/delta/`, and the docs parts are `/delta/docs/overview`,
`/delta/docs/quick-start`, and `/delta/docs/language-reference`, with a `#`
naming a section. GitHub Pages only serves files that exist, so the build
copies `index.html` to each docs path (listed in `src/routes.ts`). Old
`#/getting-started/…` links redirect to the matching path.

## Analytics

Google Analytics runs on the built site only, never in `npm run dev`. The
measurement ID is `gaMeasurementId` in `src/site.ts`; leave it empty to turn
analytics off.

## Playground link

During development, the Playground links point to
`http://localhost:3005/examples/kinetic2D`. For a deployed site, they default to
`/playground/examples/kinetic2D`.

Set `VITE_PLAYGROUND_URL` when the Formula Editor is hosted elsewhere:

```bash
VITE_PLAYGROUND_URL=https://example.com/playground npm run build
```

The production site is the static `dist/` directory. No server, database, auth,
or hosting-specific runtime is required.
