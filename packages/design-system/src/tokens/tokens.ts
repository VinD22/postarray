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
  /** The strong 2px editorial outline used to frame poster-style surfaces and
   * the CTA/blush fills. */
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

/**
 * One accent family: six steps that any surface in the system can be tinted
 * with. Four families share this shape — terracotta (`accent`, navigation and
 * state), vermilion (`accentAction`, the primary commit button), marigold
 * (`accentWarm`) and ultramarine (`accentCool`).
 *
 * `default` must clear 4.5:1 as text on canvas and raised in both themes, and
 * `onAccent` must clear 4.5:1 on every fill step. Both are asserted in
 * contrast.test.ts via `documentedContrastPairs`.
 */
export interface AccentTokens {
  readonly default: string;
  readonly hover: string;
  readonly active: string;
  readonly subtleBg: string;
  readonly subtleBgHover: string;
  readonly onAccent: string;
}

/**
 * The four accent families share one shape on purpose: a surface that can be
 * tinted by `accent` can be tinted by `accentAction`, `accentWarm` or
 * `accentCool` without a second code path, and `accentFamilyPairs` below can
 * generate the same thirteen contrast pairs for each of them.
 *
 * There is no `text.accentAction` / `text.accentWarm` / `text.accentCool`
 * counterpart to the historical `text.accent`. `text.accent` duplicates
 * `accent.default` for reasons that predate this file; repeating that three
 * times more would add twelve documented pairs that measure colours already
 * measured. The families' `default` step is documented as body text on all
 * four surfaces instead, which is the assertion that actually protects a
 * reader.
 */
export type AccentFamilyKey = 'accent' | 'accentAction' | 'accentWarm' | 'accentCool';

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
  'mastodon',
  'telegram',
  'reddit',
  'wordpress',
  'medium',
  'devto',
  'pinterest',
  'discord',
  'slack',
  'google_business_profile',
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
  /**
   * Vermilion. The fill of the primary commit button, and nothing else — not
   * links, not focus, not selection, not a band or a badge. Its `onAccent`
   * step is the button's label colour and clears 4.5:1 on `default`, `hover`
   * and `active` in both themes.
   */
  readonly accentAction: AccentTokens;
  /** Marigold. Energy, celebration, highlight moments. Scene vocabulary only. */
  readonly accentWarm: AccentTokens;
  /** Ultramarine. The cool counterweight: "live" / "published" moments. */
  readonly accentCool: AccentTokens;
  readonly cta: CtaTokens;
  readonly blush: BlushTokens;
  readonly status: StatusTokens;
  /** Provider identity. Permitted on 8px dots and 1px rules. Never a surface. */
  readonly brand: BrandTokens;
}

export const lightTheme: ThemeTokens = {
  surface: {
    canvas: '#FFFCF8',
    raised: '#FFFFFF',
    sunken: '#F5F0E8',
    overlay: '#FFFFFF',
    hover: '#F5F0E8',
    active: '#EDE8E0',
    inverted: '#141413',
  },
  border: {
    subtle: '#EBE7DF',
    default: '#E0DBD1',
    strong: '#6B6866',
    focus: '#B4462B',
    bold: '#141413',
  },
  text: {
    primary: '#141413',
    secondary: '#2E2E2E',
    tertiary: '#6B6866',
    disabled: '#8A8784',
    inverted: '#FFFCF8',
    accent: '#B4462B',
  },
  accent: {
    default: '#B4462B',
    hover: '#9E3B23',
    active: '#863019',
    subtleBg: '#FBF1ED',
    subtleBgHover: '#F9EEE9',
    onAccent: '#FFFFFF',
  },
  // Vermilion. `default` is #CE2700 rather than the #E5401F–#FF4A24 the hue
  // wants to be: white measures 4.13:1 and 3.36:1 on those, under the 4.5:1
  // body floor for the button label. #CE2700 carries white at 5.36:1 and is
  // the most chromatic value available at that luminance (C*ab 85.1 against
  // terracotta's 57.9), which is what keeps the two reds 27.2 ΔE*ab apart.
  accentAction: {
    default: '#CE2700',
    hover: '#B32200',
    active: '#971C00',
    subtleBg: '#FCF0EA',
    subtleBgHover: '#FBECE5',
    onAccent: '#FFFFFF',
  },
  // Marigold. `default` is #8A6100 rather than a brighter marigold because
  // #B07D10 measures 3.63:1 on #FFFFFF, under the 4.5:1 body floor.
  accentWarm: {
    default: '#8A6100',
    hover: '#745100',
    active: '#5E4100',
    subtleBg: '#FCF4E0',
    subtleBgHover: '#F9EFD2',
    onAccent: '#FFFFFF',
  },
  // Ultramarine.
  accentCool: {
    default: '#3B4CC0',
    hover: '#3240A6',
    active: '#29358C',
    subtleBg: '#EEF0FD',
    subtleBgHover: '#E4E8FB',
    onAccent: '#FFFFFF',
  },
  cta: {
    bg: '#EDE8E0',
    bgHover: '#E8E2D6',
    bgActive: '#D6CEC0',
    on: '#141413',
  },
  blush: {
    bg: '#EDE8E0',
    bgHover: '#E8E2D6',
    on: '#141413',
  },
  status: {
    success: { fg: '#1A5A2E', bg: '#E8F0E6', border: '#3D7A4A' },
    warning: { fg: '#7A4A00', bg: '#F5ECD0', border: '#9A6B00' },
    destructive: {
      fg: '#8B1E1A',
      bg: '#F5E6E2',
      border: '#B54A3A',
      solid: '#8B1E1A',
      solidHover: '#6E1612',
      solidActive: '#4F0F0C',
      on: '#FFFFFF',
    },
    info: { fg: '#5A3DB0', bg: '#ECE8F5', border: '#7A5EC0' },
  },
  brand: {
    // Matches `--brand-x` in theme.css. It reads as the same near-black as
    // `--relay-charcoal-900` (#0F0F0E) but is its own value, not that token.
    x: '#0F0F0F',
    linkedin: '#0A66C2',
    instagram: '#C31E68',
    facebook: '#1466D2',
    youtube: '#C42B20',
    tiktok: '#111111',
    threads: '#101010',
    bluesky: '#0F5FC0',
    mastodon: '#6364FF',
    telegram: '#1A8AB8',
    reddit: '#FF4500',
    wordpress: '#21759B',
    medium: '#292929',
    devto: '#0A0A0A',
    pinterest: '#E60023',
    discord: '#5865F2',
    slack: '#4A154B',
    google_business_profile: '#1A73E8',
    fake: '#6B6560',
  },
};

export const darkTheme: ThemeTokens = {
  surface: {
    canvas: '#0F0F0E',
    raised: '#1C1C1A',
    sunken: '#080807',
    overlay: '#1E1E1C',
    hover: '#252520',
    active: '#2E2E2E',
    inverted: '#FFFCF8',
  },
  border: {
    subtle: '#2A2A28',
    default: '#3A3936',
    strong: '#8A8784',
    focus: '#E07A5F',
    bold: '#E8E2D6',
  },
  text: {
    primary: '#FFFCF8',
    secondary: '#D6D0C4',
    tertiary: '#A8A29A',
    disabled: '#7A7672',
    inverted: '#141413',
    accent: '#E07A5F',
  },
  accent: {
    default: '#E07A5F',
    hover: '#EC8B72',
    active: '#C96545',
    subtleBg: '#26140F',
    subtleBgHover: '#331A13',
    onAccent: '#141413',
  },
  // Vermilion. The dark step lightens rather than saturates (#FF6D32), and
  // sits at Lab hue 47.8° instead of the light step's 43.0°: the dark
  // destructive coral (#E85D4D) is at 34.9°, and a lightened vermilion drifts
  // into it unless it is pushed toward orange. The gap is ΔE*ab 22.1, the
  // tightest deliberate separation in the system — re-measure it before
  // retuning either ramp.
  accentAction: {
    default: '#FF6D32',
    hover: '#FF8A5B',
    active: '#E35F2A',
    subtleBg: '#2E1B13',
    subtleBgHover: '#3F2215',
    onAccent: '#141413',
  },
  // Marigold. #F5C233 rather than the #F2C044 the ramp first landed on: that
  // value sat ΔE*ab 6.5 from the dark warning foreground (#E8B84A), close
  // enough to read as the same colour. #F5C233 opens the gap to 13.1.
  accentWarm: {
    default: '#F5C233',
    hover: '#FAD25C',
    active: '#DBA919',
    subtleBg: '#241B06',
    subtleBgHover: '#302407',
    onAccent: '#141413',
  },
  // Ultramarine.
  accentCool: {
    default: '#8B9BF4',
    hover: '#A3AFF7',
    active: '#6D7FE0',
    subtleBg: '#13152C',
    subtleBgHover: '#1B1E3D',
    onAccent: '#141413',
  },
  /* CTA / blush — identical to light; see comment in theme.css section 2. */
  cta: {
    bg: '#EDE8E0',
    bgHover: '#E8E2D6',
    bgActive: '#D6CEC0',
    on: '#141413',
  },
  blush: {
    bg: '#EDE8E0',
    bgHover: '#E8E2D6',
    on: '#141413',
  },
  status: {
    success: { fg: '#7AC48A', bg: '#0E1F14', border: '#4A8A5A' },
    warning: { fg: '#E8B84A', bg: '#221E0A', border: '#9A7A1A' },
    destructive: {
      fg: '#E85D4D',
      bg: '#25120F',
      border: '#A84A3A',
      solid: '#E85D4D',
      solidHover: '#F07060',
      solidActive: '#D95A48',
      on: '#141413',
    },
    info: { fg: '#B8A0F0', bg: '#1A1430', border: '#7A5EC0' },
  },
  brand: {
    x: '#FFFCF8',
    linkedin: '#5AA5EC',
    instagram: '#F0629B',
    facebook: '#6BADF7',
    youtube: '#F0574A',
    tiktok: '#25F4EE',
    threads: '#EDEDED',
    bluesky: '#6BB0F5',
    mastodon: '#9DA0FF',
    telegram: '#7CCBFF',
    reddit: '#FF784D',
    wordpress: '#6FB5D8',
    medium: '#B5B5B5',
    devto: '#D6D0C4',
    pinterest: '#FF5A5F',
    discord: '#8B93F7',
    slack: '#E8A0C0',
    google_business_profile: '#7CB0F5',
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
    fontSize: '2.75rem',
    lineHeight: '3rem',
    letterSpacing: '-0.022em',
    fontWeight: 600,
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
    lineHeight: '1.625rem',
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
  // The editorial serif. Fraunces is loaded by the app; this stack falls back
  // to a system serif if the face is unavailable.
  serif: "'Fraunces', 'Iowan Old Style', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
  display: "'Fraunces', Georgia, serif",
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
  /** Marketing imagery only. Product controls stay tight at 2-8px so dense
   * editorial surfaces keep their crisp, printed feel. */
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

/**
 * Loop periods for continuous indicators, kept out of `durations` on purpose.
 *
 * A spinner and a skeleton pulse repeat for as long as the wait lasts. Their
 * period describes the speed of an indicator, not the length of a state
 * change, so measuring it against the 80-200ms functional ceiling would be
 * measuring the wrong thing. Naming them apart is what lets
 * `motion-literals.test.ts` insist that every other duration in `theme.css`
 * comes from the scale.
 */
export const loopDurations = {
  /** One full rotation of `Spinner`. */
  spin: 720,
  /** One breath of the skeleton pulse, and one pass of the shimmer sweep. */
  pulse: 1600,
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

/*
 * Every accent family, covered in every role it actually plays: as link,
 * marker and display text on each surface, as a fill carrying `onAccent`, as
 * the foreground of a row sitting on its own subtle wash, and as the ground a
 * focus ring or control boundary has to survive on top of.
 *
 * One generator for all four families rather than four hand-written blocks:
 * the families share `AccentTokens`, so a new family cannot be added with a
 * thinner set of guarantees than the ones already here. Any future retune of
 * any of them has to keep all thirteen green.
 */
function accentFamilyPairs(
  family: AccentFamilyKey,
  pick: (t: ThemeTokens) => AccentTokens,
): ContrastPair[] {
  return [
    ...(['canvas', 'raised', 'sunken', 'overlay'] as const).map((surface) => ({
      id: `${family}.default on surface.${surface}`,
      foreground: (t: ThemeTokens) => pick(t).default,
      background: (t: ThemeTokens) => t.surface[surface],
      purpose: 'body' as const,
    })),
    {
      id: `${family}.default on ${family}.subtleBg`,
      foreground: (t: ThemeTokens) => pick(t).default,
      background: (t: ThemeTokens) => pick(t).subtleBg,
      purpose: 'body' as const,
    },
    {
      id: `${family}.default on ${family}.subtleBgHover`,
      foreground: (t: ThemeTokens) => pick(t).default,
      background: (t: ThemeTokens) => pick(t).subtleBgHover,
      purpose: 'body' as const,
    },
    {
      // For `accent` this is `::selection`; for the two scene families it is
      // running copy inside a tinted band, which is the only place body text
      // is allowed to meet a scene colour at all (see the gradient/texture
      // policy in theme.css: never on a gradient, only on a flat wash).
      id: `text.primary on ${family}.subtleBg`,
      foreground: (t: ThemeTokens) => t.text.primary,
      background: (t: ThemeTokens) => pick(t).subtleBg,
      purpose: 'body' as const,
    },
    {
      id: `text.primary on ${family}.subtleBgHover`,
      foreground: (t: ThemeTokens) => t.text.primary,
      background: (t: ThemeTokens) => pick(t).subtleBgHover,
      purpose: 'body' as const,
    },
    {
      id: `${family}.onAccent on ${family}.default`,
      foreground: (t: ThemeTokens) => pick(t).onAccent,
      background: (t: ThemeTokens) => pick(t).default,
      purpose: 'body' as const,
    },
    {
      id: `${family}.onAccent on ${family}.hover`,
      foreground: (t: ThemeTokens) => pick(t).onAccent,
      background: (t: ThemeTokens) => pick(t).hover,
      purpose: 'body' as const,
    },
    {
      id: `${family}.onAccent on ${family}.active`,
      foreground: (t: ThemeTokens) => pick(t).onAccent,
      background: (t: ThemeTokens) => pick(t).active,
      purpose: 'body' as const,
    },
    {
      // The focus ring drawn around a control inside a tinted row or band.
      // The ring is always terracotta, whatever the band is tinted with.
      id: `border.focus on ${family}.subtleBg`,
      foreground: (t: ThemeTokens) => t.border.focus,
      background: (t: ThemeTokens) => pick(t).subtleBg,
      purpose: 'ui-boundary' as const,
    },
    {
      // An input, checkbox or hairline rule keeping its edge inside the band.
      id: `border.strong on ${family}.subtleBg`,
      foreground: (t: ThemeTokens) => t.border.strong,
      background: (t: ThemeTokens) => pick(t).subtleBg,
      purpose: 'ui-boundary' as const,
    },
  ];
}

const accentPairs: ContrastPair[] = [
  ...accentFamilyPairs('accent', (t) => t.accent),
  ...accentFamilyPairs('accentAction', (t) => t.accentAction),
  ...accentFamilyPairs('accentWarm', (t) => t.accentWarm),
  ...accentFamilyPairs('accentCool', (t) => t.accentCool),
];

export const documentedContrastPairs: readonly ContrastPair[] = [
  ...textOnSurfacePairs,
  ...statusPairs,
  ...brandPairs,
  ...accentPairs,
  // `accent.onAccent on accent.{default,hover,active}` used to be spelled out
  // here; `accentFamilyPairs` above now generates it for all three families.
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
   * CTA and blush fills. In the editorial system these are warm paper tints
   * (not neon yellow/pink), so ink text on them clears body-text contrast by
   * a wide margin. They are documented as fg/bg pairs for their own
   * ink-on-fill foreground (`cta.on` / `blush.on`) plus the `border.bold`
   * outline against the canvas/raised surfaces it sits on.
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
