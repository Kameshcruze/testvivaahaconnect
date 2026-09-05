// Google Analytics 4 (GA4) helper for Vivaaha Connect
export const GA_MEASUREMENT_ID = 'G-JGE43FGC4Q';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track SPA virtual page views in GA4
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}

/**
 * Track custom user actions (e.g. registration steps, calls, WhatsApp clicks)
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}
