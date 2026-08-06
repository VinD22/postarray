/**
 * The same tokens declared in theme.css, as typed TypeScript constants.
 *
 * CSS is the source of truth for anything the DOM renders. This module exists
 * for consumers that cannot read a custom property: canvas media previews,
 * chart renderers, generated OG images, and the contrast gate in
 * contrast.test.ts. The values must stay byte-identical to theme.css; the
 * contrast test is what stops them drifting into an inaccessible pair.
 */

export type ThemeName = 'light' | 'dark';

export interface SurfaceTokens {
  readonly canvas: string;
  readonly raised: string;
  readonly sunken: string;
  readonly overlay: string;
  readonly hover: string;
  readonly active: string;
  readonly inverted: string;
}

export interface BorderTokens {
  readonly subtle: string;
  readonly default: string;
  readonly strong: string;
  readonly focus: string;
  /** The 2px poster outline. Mandatory boundary for cta/blush fills, which
   * fail contrast as a sole edge on light surfaces (see documentedContrastPairs
   * comment below). */
  readonly bold: string;
}

export interface TextTokens {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly disabled: string;
  readonly inverted: string;
  readonly accent: string;
}

export interface AccentTokens {
  readonly default: string;
  readonly hover: string;
  readonly active: string;
  readonly subtleBg: string;
  readonly subtleBgHover: string;
  readonly onAccent: string;
}

export interface StatusTone {
  readonly fg: string;
  readonly bg: string;
  readonly border: string;
}

/** Sunshine-yellow CTA fills. Never used as text — ink (`on`) is the only
 * legible foreground for this family. Identical in both themes. */
export interface CtaTokens {
  readonly bg: string;
  readonly bgHover: string;
  readonly bgActive: string;
  readonly on: string;
}

/** Bubblegum-pink decorative/badge fills. Never used as text — ink (`on`) is
 * the only legible foreground for this family. Identical in both themes. */
export interface BlushTokens {
  readonly bg: string;
  readonly bgHover: string;
  readonly on: string;
}

export interface DestructiveTone extends StatusTone {
  readonly solid: string;
  readonly solidHover: string;
  readonly solidActive: string;
  readonly on: string;
}

export interface StatusTokens {
  readonly success: StatusTone;
  readonly warning: StatusTone;
  readonly destructive: DestructiveTone;
  readonly info: StatusTone;
}

export const PROVIDER_KEYS = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  /**
   * The local development connector. It mirrors `ProviderId` in
   * `@relay/contracts`, which is the authoritative provider union; the design
   * system cannot import a product package, so the list is restated here and
   * must be kept identical to it.
   */
  'fake',
] as const;

export type ProviderKey = (typeof PROVIDER_KEYS)[number];

export type BrandTokens = Readonly<Record<ProviderKey, string>>;

export interface ThemeTokens {
  readonly surface: SurfaceTokens;
  readonly border: BorderTokens;
  readonly text: TextTokens;
  readonly accent: AccentTokens;
  readonly cta: CtaTokens;
  readonly blush: BlushTokens;
  readonly status: StatusTokens;
  /** Provider identity. Permitted on 8px dots and 1px rules. Never a surface. */
  readonly brand: BrandTokens;
}

export const lightTheme: ThemeTokens = {
  surface: {
    canvas: '#F7F7F6',
    raised: '#FFFFFF',
    sunken: '#EFEFEC',
    overlay: '#FFFFFF',
    hover: '#EFEFEC',
    active: '#E9E9E5',
    inverted: '#131313',
  },
  border: {
    subtle: '#ECECE9',
    default: '#DFDFDB',
    strong: '#6F6F6B',
    focus: '#2951E6',
    bold: '#131313',
  },
  text: {
    primary: '#131313',
    secondary: '#454545',
    tertiary: '#5C5C5A',
    disabled: '#83837F',
    inverted: '#F7F7F6',
    accent: '#2951E6',
  },
  accent: {
    default: '#2951E6',
    hover: '#1E3FC4',
    active: '#16309B',
    subtleBg: '#DDE5FC',
    subtleBgHover: '#D6E0FB',
    onAccent: '#FFFFFF',
  },
  cta: {
    bg: '#FAD84C',
    bgHover: '#F2CB2F',
    bgActive: '#E8BE1D',
    on: '#131313',
  },
  blush: {
    bg: '#F7B7D4',
    bgHover: '#F2A2C8',
    on: '#131313',
  },
  status: {
    success: { fg: '#0E6B31', bg: '#DCF3E1', border: '#2E9E54' },
    warning: { fg: '#805200', bg: '#FCEFC7', border: '#B98300' },
    destructive: {
      fg: '#C81E12',
      bg: '#FBE5E2',
      border: '#D9564B',
      solid: '#C81E12',
      solidHover: '#A81409',
      solidActive: '#8C0F06',
      on: '#FFFFFF',
    },
    info: { fg: '#6636D6', bg: '#EAE3FB', border: '#8B66E0' },
  },
  brand: {
    x: '#0F0F0F',
    linkedin: '#0A66C2',
    instagram: '#C31E68',
    facebook: '#1466D2',
    youtube: '#C42B20',
    tiktok: '#111111',
    threads: '#101010',
    bluesky: '#0F5FC0',
    fake: '#6B6560',
  },
};

export const darkTheme: ThemeTokens = {
  surface: {
    canvas: '#0D0F1E',
    raised: '#15182C',
    sunken: '#080911',
    overlay: '#1B1F38',
    hover: '#1F2340',
    active: '#262B4C',
    inverted: '#F2F2EF',
  },
  border: {
    subtle: '#232741',
    default: '#2E3354',
    strong: '#7D8199',
    focus: '#8FA5FF',
    bold: '#E4E6EE',
  },
  text: {
    primary: '#F2F2EF',
    secondary: '#B9BCC8',
    tertiary: '#969AAB',
    disabled: '#6C7085',
    inverted: '#131313',
    accent: '#8FA5FF',
  },
  accent: {
    default: '#8FA5FF',
    hover: '#A9BAFF',
    active: '#7B93FA',
    subtleBg: '#1C2350',
    subtleBgHover: '#232C60',
    onAccent: '#131313',
  },
  /* CTA / blush — identical to light; see comment in theme.css section 2. */
  cta: {
    bg: '#FAD84C',
    bgHover: '#F2CB2F',
    bgActive: '#E8BE1D',
    on: '#131313',
  },
  blush: {
    bg: '#F7B7D4',
    bgHover: '#F2A2C8',
    on: '#131313',
  },
  status: {
    success: { fg: '#57C97C', bg: '#0E2417', border: '#379A5C' },
    warning: { fg: '#E9B949', bg: '#2A2108', border: '#A98416' },
    destructive: {
      fg: '#FF7A6E',
      bg: '#2D100C',
      border: '#C05248',
      solid: '#FF7A6E',
      solidHover: '#FF958B',
      solidActive: '#F0655A',
      on: '#131313',
    },
    info: { fg: '#B79BFF', bg: '#1F1640', border: '#8468C9' },
  },
  brand: {
    x: '#E8E8E8',
    linkedin: '#5AA5EC',
    instagram: '#F0629B',
    facebook: '#6BADF7',
    youtube: '#F0574A',
    tiktok: '#25F4EE',
    threads: '#EDEDED',
    bluesky: '#6BB0F5',
    fake: '#A8A29A',
  },
};

export const themes: Readonly<Record<ThemeName, ThemeTokens>> = {
  light: lightTheme,
  dark: darkTheme,
};

/* --------------------------------------------------------------------------
 * Typography
 * ----------------------------------------------------------------------- */

export interface TypeStep {
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly letterSpacing: string;
  readonly fontWeight: number;
}

export type TypeScaleKey =
  | 'display'
  | 'titleLg'
  | 'titleMd'
  | 'titleSm'
  | 'bodyLg'
  | 'bodyMd'
  | 'bodySm'
  | 'label'
  | 'mono'
  | 'code';

export const typeScale: Readonly<Record<TypeScaleKey, TypeStep>> = {
  display: {
    fontSize: '2.5rem',
    lineHeight: '2.75rem',
    letterSpacing: '-0.022em',
    fontWeight: 700,
  },
  titleLg: {
    fontSize: '1.75rem',
    lineHeight: '2.125rem',
    letterSpacing: '-0.018em',
    fontWeight: 600,
  },
  titleMd: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    letterSpacing: '-0.012em',
    fontWeight: 600,
  },
  titleSm: {
    fontSize: '1rem',
    lineHeight: '1.375rem',
    letterSpacing: '-0.006em',
    fontWeight: 600,
  },
  bodyLg: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    letterSpacing: '-0.003em',
    fontWeight: 400,
  },
  bodyMd: {
    fontSize: '0.875rem',
    lineHeight: '1.3125rem',
    letterSpacing: '0em',
    fontWeight: 400,
  },
  bodySm: {
    fontSize: '0.8125rem',
    lineHeight: '1.1875rem',
    letterSpacing: '0.002em',
    fontWeight: 400,
  },
  label: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.01em',
    fontWeight: 550,
  },
  mono: {
    fontSize: '0.8125rem',
    lineHeight: '1.25rem',
    letterSpacing: '0.005em',
    fontWeight: 400,
  },
  code: {
    fontSize: '0.8125rem',
    lineHeight: '1.25rem',
    letterSpacing: '0em',
    fontWeight: 400,
  },
};

export const fontFamilies = {
  sans:
    "'Inter Variable', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', " +
    "'Noto Sans', 'Noto Sans Arabic', 'Noto Sans Hebrew', 'Noto Sans JP', " +
    "'Noto Sans KR', 'Noto Sans SC', sans-serif",
  // The Source Serif 4 webfont is no longer loaded; this is the system serif
  // fallback stack that `font-serif` usages render on until they migrate to
  // `font-display`.
  serif: "'Iowan Old Style', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
  display: "'Bricolage Grotesque', 'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif",
} as const;

/* --------------------------------------------------------------------------
 * Space, shape, motion, layering
 * ----------------------------------------------------------------------- */

/** 4px base. Index is the multiplier, value is the resolved pixel count. */
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const SPACING_BASE_PX = 4;

/** The minimum touch target on coarse pointers. */
export const TOUCH_TARGET_MIN_PX = 44;

export const radii = {
  xs: '0px',
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  /** Marketing imagery / poster-style panels only. Product controls stay at
   * 2-8px — the "sharpened" near-square scale is the loud aesthetic's edge. */
  editorial: '20px',
  /** Alias of `editorial`, matching `--radius-poster` in theme.css. */
  poster: '20px',
  full: '9999px',
} as const;

export const borderWidths = {
  hairline: '1px',
  emphasis: '1.5px',
  focus: '2px',
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  drawer: 30,
  dropdown: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  toast: 80,
  tooltip: 90,
  /** The custom cursor dot/ring on marketing. Above everything else. */
  cursor: 100,
} as const;

/** Functional tier (unchanged, in-app): 80-200ms. Expressive tier (marketing /
 * overlay choreography): 400-900ms with overshoot/expo eases below. */
export const durations = {
  instant: 80,
  fast: 120,
  base: 160,
  slow: 200,
  expressiveSm: 400,
  expressiveMd: 650,
  expressiveLg: 900,
} as const;

export const easings = {
  standard: 'cubic-bezier(0.2, 0, 0.15, 1)',
  entrance: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  exit: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/** The widths every screen is designed and tested at. */
export const breakpoints = {
  xs: 360,
  sm: 390,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1920,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

/* --------------------------------------------------------------------------
 * Documented contrast pairs. The contrast test iterates this list, so adding a
 * semantic colour without adding its pair here is a review failure, and adding
 * a pair that does not clear AA fails the build.
 * ----------------------------------------------------------------------- */

export interface ContrastPair {
  readonly id: string;
  readonly foreground: (t: ThemeTokens) => string;
  readonly background: (t: ThemeTokens) => string;
  readonly purpose: 'body' | 'large-text' | 'ui-boundary';
}

const SURFACES: readonly (keyof SurfaceTokens)[] = ['canvas', 'raised', 'sunken', 'overlay'];

const textOnSurfacePairs: ContrastPair[] = SURFACES.flatMap((surface) => [
  {
    id: `text.primary on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.text.primary,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'body' as const,
  },
  {
    id: `text.secondary on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.text.secondary,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'body' as const,
  },
  {
    id: `text.tertiary on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.text.tertiary,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'body' as const,
  },
  {
    id: `text.accent on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.text.accent,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'body' as const,
  },
  {
    id: `border.strong on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.border.strong,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'ui-boundary' as const,
  },
  {
    id: `text.disabled on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.text.disabled,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'ui-boundary' as const,
  },
  {
    id: `border.focus on surface.${surface}`,
    foreground: (t: ThemeTokens) => t.border.focus,
    background: (t: ThemeTokens) => t.surface[surface],
    purpose: 'ui-boundary' as const,
  },
]);

const STATUS_KEYS = ['success', 'warning', 'destructive', 'info'] as const;

const statusPairs: ContrastPair[] = STATUS_KEYS.flatMap((key) => [
  {
    id: `status.${key}.fg on status.${key}.bg`,
    foreground: (t: ThemeTokens) => t.status[key].fg,
    background: (t: ThemeTokens) => t.status[key].bg,
    purpose: 'body' as const,
  },
  {
    id: `status.${key}.fg on surface.canvas`,
    foreground: (t: ThemeTokens) => t.status[key].fg,
    background: (t: ThemeTokens) => t.surface.canvas,
    purpose: 'body' as const,
  },
  {
    id: `status.${key}.fg on surface.raised`,
    foreground: (t: ThemeTokens) => t.status[key].fg,
    background: (t: ThemeTokens) => t.surface.raised,
    purpose: 'body' as const,
  },
  {
    id: `status.${key}.border on surface.canvas`,
    foreground: (t: ThemeTokens) => t.status[key].border,
    background: (t: ThemeTokens) => t.surface.canvas,
    purpose: 'ui-boundary' as const,
  },
  {
    id: `status.${key}.border on surface.raised`,
    foreground: (t: ThemeTokens) => t.status[key].border,
    background: (t: ThemeTokens) => t.surface.raised,
    purpose: 'ui-boundary' as const,
  },
]);

const brandPairs: ContrastPair[] = PROVIDER_KEYS.flatMap((key) => [
  {
    id: `brand.${key} on surface.canvas`,
    foreground: (t: ThemeTokens) => t.brand[key],
    background: (t: ThemeTokens) => t.surface.canvas,
    purpose: 'ui-boundary' as const,
  },
  {
    id: `brand.${key} on surface.raised`,
    foreground: (t: ThemeTokens) => t.brand[key],
    background: (t: ThemeTokens) => t.surface.raised,
    purpose: 'ui-boundary' as const,
  },
]);

export const documentedContrastPairs: readonly ContrastPair[] = [
  ...textOnSurfacePairs,
  ...statusPairs,
  ...brandPairs,
  {
    id: 'accent.onAccent on accent.default',
    foreground: (t) => t.accent.onAccent,
    background: (t) => t.accent.default,
    purpose: 'body',
  },
  {
    id: 'accent.onAccent on accent.hover',
    foreground: (t) => t.accent.onAccent,
    background: (t) => t.accent.hover,
    purpose: 'body',
  },
  {
    id: 'accent.onAccent on accent.active',
    foreground: (t) => t.accent.onAccent,
    background: (t) => t.accent.active,
    purpose: 'body',
  },
  {
    id: 'text.accent on accent.subtleBg',
    foreground: (t) => t.text.accent,
    background: (t) => t.accent.subtleBg,
    purpose: 'body',
  },
  {
    id: 'text.accent on accent.subtleBgHover',
    foreground: (t) => t.text.accent,
    background: (t) => t.accent.subtleBgHover,
    purpose: 'body',
  },
  {
    id: 'status.destructive.on on status.destructive.solid',
    foreground: (t) => t.status.destructive.on,
    background: (t) => t.status.destructive.solid,
    purpose: 'body',
  },
  {
    id: 'status.destructive.on on status.destructive.solidHover',
    foreground: (t) => t.status.destructive.on,
    background: (t) => t.status.destructive.solidHover,
    purpose: 'body',
  },
  {
    id: 'status.destructive.on on status.destructive.solidActive',
    foreground: (t) => t.status.destructive.on,
    background: (t) => t.status.destructive.solidActive,
    purpose: 'body',
  },
  {
    id: 'text.inverted on surface.inverted',
    foreground: (t) => t.text.inverted,
    background: (t) => t.surface.inverted,
    purpose: 'body',
  },
  {
    id: 'text.primary on surface.hover',
    foreground: (t) => t.text.primary,
    background: (t) => t.surface.hover,
    purpose: 'body',
  },
  {
    id: 'text.primary on surface.active',
    foreground: (t) => t.text.primary,
    background: (t) => t.surface.active,
    purpose: 'body',
  },
  {
    id: 'text.secondary on surface.hover',
    foreground: (t) => t.text.secondary,
    background: (t) => t.surface.hover,
    purpose: 'body',
  },
  /*
   * CTA (yellow) and blush (pink) fills. These are documented as fg/bg pairs
   * ONLY for their own ink-on-fill foreground (`cta.on` / `blush.on`) and for
   * the mandatory `border.bold` outline against the canvas/raised surfaces it
   * sits on. We deliberately do NOT add `cta.bg` / `blush.bg` as a foreground
   * (or a border) directly against `surface.*` — yellow on paper is 1.30:1
   * and pink on paper is 1.54:1, both well under the 3:1 ui-boundary floor.
   * That failure is by design: cta/blush fills are never a standalone edge:
   * every cta/blush surface ships with the 2px `--border-bold` outline as its
   * actual boundary, which is what the `border.bold` pairs below verify.
   */
  {
    id: 'cta.on on cta.bg',
    foreground: (t) => t.cta.on,
    background: (t) => t.cta.bg,
    purpose: 'body',
  },
  {
    id: 'cta.on on cta.bgHover',
    foreground: (t) => t.cta.on,
    background: (t) => t.cta.bgHover,
    purpose: 'body',
  },
  {
    id: 'cta.on on cta.bgActive',
    foreground: (t) => t.cta.on,
    background: (t) => t.cta.bgActive,
    purpose: 'body',
  },
  {
    id: 'blush.on on blush.bg',
    foreground: (t) => t.blush.on,
    background: (t) => t.blush.bg,
    purpose: 'body',
  },
  {
    id: 'blush.on on blush.bgHover',
    foreground: (t) => t.blush.on,
    background: (t) => t.blush.bgHover,
    purpose: 'body',
  },
  {
    id: 'border.bold on surface.canvas',
    foreground: (t) => t.border.bold,
    background: (t) => t.surface.canvas,
    purpose: 'ui-boundary',
  },
  {
    id: 'border.bold on surface.raised',
    foreground: (t) => t.border.bold,
    background: (t) => t.surface.raised,
    purpose: 'ui-boundary',
  },
];
