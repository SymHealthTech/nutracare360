// Global typings for the Google Analytics gtag.js runtime injected by
// @next/third-parties' <GoogleAnalytics /> component. Keeping these here means
// lib/analytics.ts can call window.gtag with no `any` casts.

type GtagParams = Record<string, string | number | boolean>;

interface Window {
  dataLayer: unknown[];
  gtag?: (
    command: "event" | "config" | "set" | "consent" | "js",
    targetOrName: string | Date,
    params?: GtagParams,
  ) => void;
}
