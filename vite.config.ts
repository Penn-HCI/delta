import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

import { docsPageFiles } from "./src/routes";

// GitHub Pages only serves files that exist, so after the build, copy the page
// to each docs path. The app reads the path to show the right page.
function pagePerPath(): Plugin {
  return {
    name: "page-per-path",
    apply: "build",
    writeBundle({ dir = "dist" }) {
      for (const file of docsPageFiles) {
        mkdirSync(dirname(join(dir, file)), { recursive: true });
        copyFileSync(join(dir, "index.html"), join(dir, file));
      }
    },
  };
}

export default defineConfig({
  // The site is served from https://www.pennhci.com/delta/. Its pages sit at
  // different depths, so asset addresses start from the base path.
  base: "/delta/",
  plugins: [react(), pagePerPath()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "mobx",
      "mobx-react-lite",
      "mobx-state-tree",
    ],
  },
});
