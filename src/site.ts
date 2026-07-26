export const playgroundUrl =
  import.meta.env.VITE_PLAYGROUND_URL ||
  "https://delta-dsl-playground.vercel.app/";

export const assetUrl = (file: string) =>
  `${import.meta.env.BASE_URL}${file}`;
