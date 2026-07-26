export const playgroundUrl =
  import.meta.env.VITE_PLAYGROUND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3005/examples/kinetic2D"
    : "/playground/examples/kinetic2D");

export const assetUrl = (file: string) =>
  `${import.meta.env.BASE_URL}${file}`;
