import { gaMeasurementId } from "./site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Loads the Google tag (gtag.js) on the built site, so local development
// doesn't add visits. Every page has a real path, so the tag's own page views
// are enough: one on each load, and one when a docs link changes the path.
export function startAnalytics() {
  if (!import.meta.env.PROD || !gaMeasurementId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array copy.
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId);
}
