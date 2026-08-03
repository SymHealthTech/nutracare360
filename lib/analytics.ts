// Thin, typed wrapper around the gtag.js runtime loaded by
// @next/third-parties' <GoogleAnalytics /> (see app/layout.tsx).
//
// trackEvent no-ops safely when gtag is unavailable — during SSR, in
// development (where <GoogleAnalytics /> is not rendered), or before the
// script has finished loading — so callers never need their own guards.

export type AnalyticsParams = Record<string, string | number | boolean>;

export function trackEvent(name: string, params?: AnalyticsParams): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
