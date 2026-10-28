/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Small text opens up its letter spacing to stay readable (see DESIGN.md).
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.03em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em" }],
      },
    },
  },
  plugins: [],
};
