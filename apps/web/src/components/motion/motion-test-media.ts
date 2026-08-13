/**
 * Test-only support for the motion primitives beside it.
 *
 * Not a component and not shipped: nothing under `src/app` or `src/features`
 * imports it, and it is only ever pulled in from a `*.test.tsx` in this
 * directory. It lives here rather than in `src/test/` because it encodes
 * something specific to this directory — every primitive here has two
 * behaviours, and both have to be exercised.
 *
 * `src/test/setup.ts` installs a permanent "no preference" `matchMedia` that
 * answers `false` to everything, which means the DEFAULT answer to
 * `(prefers-reduced-motion: reduce)` in a test is "motion is fine". A test
 * that never touches `matchMedia` is therefore testing the animated path only.
 * `mockMotionPreference` replaces that stub for one test so the reduced-motion
 * path can be tested too; `restoreMotionPreference` puts it back in `afterEach`.
 */

const HIDDEN_STATE_CLASSES = ['opacity-0', 'invisible', 'hidden'] as const;

type MatchMedia = typeof window.matchMedia;

let original: MatchMedia | undefined;

export function mockMotionPreference(preference: 'reduce' | 'no-preference'): void {
  original ??= window.matchMedia;
  const reduce = preference === 'reduce';
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce')
        ? reduce
        : query.includes('pointer: fine'),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

export function restoreMotionPreference(): void {
  if (!original) return;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: original,
  });
  original = undefined;
}

/**
 * The classes that would mean "hidden until JS says otherwise". None of them
 * may appear in server HTML: that HTML is the finished page for crawlers,
 * no-JS clients and reduced-motion visitors, and it is also what the LCP
 * measurement sees.
 */
export function hiddenStateClassesIn(markup: string): readonly string[] {
  return HIDDEN_STATE_CLASSES.filter((name) =>
    new RegExp(`class="[^"]*\\b${name}\\b`).test(markup),
  );
}

/** Every element carrying an inline transform, in source order. */
export function inlineTransformsIn(container: HTMLElement): readonly string[] {
  return [...container.querySelectorAll<HTMLElement>('[style]')]
    .map((node) => node.style.transform)
    .filter((value) => value !== '');
}
