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
  readonly status: StatusTokens;
  /** Provider identity. Permitted on 8px dots and 1px rules. Never a surface. */
  readonly brand: BrandTokens;
}

export const lightTheme: ThemeTokens = {
  surface: {
    canvas: '#FAF9F7',
    raised: '#FFFFFF',
    sunken: '#F1EFEA',
    overlay: '#FFFFFF',
    hover: '#F1EFEA',
    active: '#E9E6E0',
    inverted: '#211E1B',
  },
  border: {
    subtle: '#EFECE6',
    default: '#DCD7CF',
    strong: '#8C857A',
    focus: '#12585F',
  },
  text: {
    primary: '#1B1917',
    secondary: '#524C45',
    tertiary: '#6E675F',
    disabled: '#8C857A',
    inverted: '#FAF9F7',
    accent: '#12585F',
  },
  accent: {
    default: '#12585F',
    hover: '#0E4A50',
    active: '#0A3B40',
    subtleBg: '#E2EFEF',
    subtleBgHover: '#D3E5E5',
    onAccent: '#FFFFFF',
  },
  status: {
    success: { fg: '#1C5B3C', bg: '#E5F1E9', border: '#4F8A6B' },
    warning: { fg: '#7A4400', bg: '#FBF0DA', border: '#A9791F' },
    destructive: {
      fg: '#9A2016',
      bg: '#FCE9E6',
      border: '#C05B4C',
      solid: '#9A2016',
      solidHover: '#82190F',
      solidActive: '#6B1309',
      on: '#FFFFFF',
    },
    info: { fg: '#2A4C72', bg: '#E8EFF6', border: '#6388AE' },
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
    canvas: '#191715',
    raised: '#211E1B',
    sunken: '#121110',
    overlay: '#272320',
    hover: '#2A2622',
    active: '#322D28',
    inverted: '#F2EFE9',
  },
  border: {
    subtle: '#2A2723',
    default: '#3A352F',
    strong: '#7A7168',
    focus: '#4FB6A8',
  },
  text: {
    primary: '#F2EFE9',
    secondary: '#B5AEA3',
    tertiary: '#9A9184',
    disabled: '#7A7168',
    inverted: '#17150F',
    accent: '#4FB6A8',
  },
  accent: {
    default: '#4FB6A8',
    hover: '#68C7BA',
    active: '#3C9E91',
    subtleBg: '#16302E',
    subtleBgHover: '#1D3E3B',
    onAccent: '#0A2422',
  },
  status: {
    success: { fg: '#7CC79B', bg: '#16281E', border: '#57906F' },
    warning: { fg: '#E0AE5E', bg: '#2B2114', border: '#977540' },
    destructive: {
      fg: '#F08A7C',
      bg: '#2E1A17',
      border: '#AC6053',
      solid: '#DC7365',
      solidHover: '#E9877A',
      solidActive: '#CE6154',
      on: '#170F0D',
    },
    info: { fg: '#8FB6DD', bg: '#182430', border: '#5C7F9B' },
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
    fontWeight: 620,
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
  serif: "'Source Serif 4', 'Iowan Old Style', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
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
  xs: '3px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '10px',
  /** Marketing imagery only. Product controls stay at 6-10px. */
  editorial: '14px',
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
} as const;

export const durations = {
  instant: 80,
  fast: 120,
  base: 160,
  slow: 200,
} as const;

export const easings = {
  standard: 'cubic-bezier(0.2, 0, 0.15, 1)',
  entrance: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  exit: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
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

const SURFACES: readonly (keyof SurfaceTokens)[] = [
  'canvas',
  'raised',
  'sunken',
  'overlay',
];

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
];
