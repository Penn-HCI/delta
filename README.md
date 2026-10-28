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

The site opens at `http://localhost:5173`. The full Formula Editor playground
runs separately at `http://localhost:3005`.

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
