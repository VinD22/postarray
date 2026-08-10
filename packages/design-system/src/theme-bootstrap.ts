/** The key shared by the pre-paint bootstrap and the client theme module. */
export const THEME_STORAGE_KEY = 'relay.theme';

/** The system preference query shared by both theme implementations. */
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * Dependency-free JavaScript that applies the stored theme before first paint.
 *
 * This module is deliberately server-safe. React hooks remain behind the
 * `@relay/design-system/hooks` entry point, while server layouts import only
 * this string through `@relay/design-system/theme-bootstrap`.
 */
export const themeBootstrapScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var p=localStorage.getItem(k);var t=p==="light"||p==="dark"?p:(window.matchMedia&&window.matchMedia(${JSON.stringify(
  THEME_MEDIA_QUERY,
)}).matches?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){}})();`;
