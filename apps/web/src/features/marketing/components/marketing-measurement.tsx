'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Field measurement for the public site, through the analytics the root
 * layout already loads (cookieless, no IP address stored).
 *
 * - Core Web Vitals, one event per metric, rounded, with the route template
 *   rather than the full URL.
 * - Tool usage: the first input inside a `[data-tool-path]` region. Only the
 *   tool's path is sent. What a person types never leaves the browser.
 * - Signup attribution: a click on any sign-up link, with the page it came
 *   from.
 *
 * Renders nothing.
 */
/** `ROUTES.signUp`, with or without a locale prefix. Not imported from the
 *  site map, which would pull the route registries into a client bundle. */
const SIGN_UP_PATH = /(^|\/)sign-up\/?$/;

const REPORTED_VITALS = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);

function isSignUpHref(href: string): boolean {
  try {
    const path = new URL(href, window.location.origin).pathname;
    return SIGN_UP_PATH.test(path);
  } catch {
    return false;
  }
}

export function MarketingMeasurement(): null {
  useReportWebVitals((metric) => {
    if (!REPORTED_VITALS.has(metric.name)) {
      return;
    }
    track('web_vital', {
      name: metric.name,
      value:
        metric.name === 'CLS' ? Math.round(metric.value * 1000) / 1000 : Math.round(metric.value),
      rating: metric.rating,
      path: window.location.pathname,
    });
  });

  useEffect(() => {
    const usedTools = new Set<string>();

    function onInput(event: Event): void {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const region = target.closest('[data-tool-path]');
      const tool = region?.getAttribute('data-tool-path');
      if (tool === null || tool === undefined || usedTools.has(tool)) {
        return;
      }
      usedTools.add(tool);
      track('tool_used', { tool });
    }

    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest('a[href]');
      const href = anchor?.getAttribute('href');
      if (href === null || href === undefined || !isSignUpHref(href)) {
        return;
      }
      track('signup_click', { from: window.location.pathname });
    }

    document.addEventListener('input', onInput, true);
    document.addEventListener('change', onInput, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('change', onInput, true);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  return null;
}
