// Set to false to show the real site instead of the "Under construction" page.
export const underConstruction: boolean = false;

// Set to true to show the animated numbers-and-operators background.
export const showNumberBackground: boolean = false;

export const playgroundUrl =
  import.meta.env.VITE_PLAYGROUND_URL ||
  "https://delta-dsl-playground.vercel.app/";

// Google Analytics 4 measurement ID ("G-…"). Analytics stays off while it's
// empty, and it only runs on the built site, never in `npm run dev`.
export const gaMeasurementId = "G-TTG418LR6T";

export const assetUrl = (file: string) =>
  `${import.meta.env.BASE_URL}${file}`;
