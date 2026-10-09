// Set to false to show the real site instead of the "Under construction" page.
export const underConstruction: boolean = true;

export const playgroundUrl =
  import.meta.env.VITE_PLAYGROUND_URL ||
  "https://delta-dsl-playground.vercel.app/";

export const assetUrl = (file: string) =>
  `${import.meta.env.BASE_URL}${file}`;
