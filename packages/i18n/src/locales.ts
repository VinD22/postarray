/**
 * The registry of every locale Relay plans to ship.
 *
 * V1 ships English only. Every other entry is `planned`: its metadata is real
 * and already drives layout direction, week start, hour cycle and plural
 * handling, so switching a locale on is a catalog file plus a status change.
 *
 * `defaultDateFormat` is documentation of the conventional short date order for
 * the locale. Actual rendering always goes through `Intl` in `./format.ts`; the
 * pattern exists so designers and reviewers can reason about column widths.
 */

export type TextDirection = 'ltr' | 'rtl';

export type LocaleStatus = 'active' | 'planned';

/** CLDR cardinal plural categories. */
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/** 0 is Sunday, 1 is Monday, 6 is Saturday. */
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type HourCycle = 'h11' | 'h12' | 'h23' | 'h24';

/** Locale metadata without the rollout status, shared with pseudo locales. */
export interface LocaleFormatting {
  /** BCP-47 language tag. Also the registry key. */
  readonly bcp47: string;
  /** Name in English, for admin surfaces and documentation. */
  readonly name: string;
  /** Name in the language itself, for the language picker. */
  readonly endonym: string;
  /** ISO 15924 script code. */
  readonly script: string;
  readonly direction: TextDirection;
  readonly pluralCategories: readonly PluralCategory[];
  /** Conventional short date pattern. Documentation, not a formatter input. */
  readonly defaultDateFormat: string;
  readonly weekStartsOn: WeekDayIndex;
  readonly hourCycle: HourCycle;
}

export interface LocaleDescriptor extends LocaleFormatting {
  readonly status: LocaleStatus;
}

const LOCALE_LIST = [
  {
    bcp47: 'en',
    name: 'English',
    endonym: 'English',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'MMM d, y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'active',
  },
  {
    bcp47: 'es',
    name: 'Spanish (Spain)',
    endonym: 'Español (España)',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'es-419',
    name: 'Spanish (Latin America)',
    endonym: 'Español (Latinoamérica)',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'pt-BR',
    name: 'Portuguese (Brazil)',
    endonym: 'Português (Brasil)',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'pt-PT',
    name: 'Portuguese (Portugal)',
    endonym: 'Português (Portugal)',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd/MM/y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'fr',
    name: 'French',
    endonym: 'Français',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'de',
    name: 'German',
    endonym: 'Deutsch',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd. MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'it',
    name: 'Italian',
    endonym: 'Italiano',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'nl',
    name: 'Dutch',
    endonym: 'Nederlands',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'pl',
    name: 'Polish',
    endonym: 'Polski',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'few', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'cs',
    name: 'Czech',
    endonym: 'Čeština',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'few', 'many', 'other'],
    defaultDateFormat: 'd. M. y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'sv',
    name: 'Swedish',
    endonym: 'Svenska',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'nb',
    name: 'Norwegian Bokmal',
    endonym: 'Norsk bokmål',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd. MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'da',
    name: 'Danish',
    endonym: 'Dansk',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd. MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'fi',
    name: 'Finnish',
    endonym: 'Suomi',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd.M.y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'tr',
    name: 'Turkish',
    endonym: 'Türkçe',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'ru',
    name: 'Russian',
    endonym: 'Русский',
    script: 'Cyrl',
    direction: 'ltr',
    pluralCategories: ['one', 'few', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'uk',
    name: 'Ukrainian',
    endonym: 'Українська',
    script: 'Cyrl',
    direction: 'ltr',
    pluralCategories: ['one', 'few', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'ar',
    name: 'Arabic',
    endonym: 'العربية',
    script: 'Arab',
    direction: 'rtl',
    pluralCategories: ['zero', 'one', 'two', 'few', 'many', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 6,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'he',
    name: 'Hebrew',
    endonym: 'עברית',
    script: 'Hebr',
    direction: 'rtl',
    pluralCategories: ['one', 'two', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'hi',
    name: 'Hindi',
    endonym: 'हिन्दी',
    script: 'Deva',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'bn',
    name: 'Bengali',
    endonym: 'বাংলা',
    script: 'Beng',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM, y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'ur',
    name: 'Urdu',
    endonym: 'اردو',
    script: 'Arab',
    direction: 'rtl',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'id',
    name: 'Indonesian',
    endonym: 'Bahasa Indonesia',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'ms',
    name: 'Malay',
    endonym: 'Bahasa Melayu',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 1,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'vi',
    name: 'Vietnamese',
    endonym: 'Tiếng Việt',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'd MMM, y',
    weekStartsOn: 1,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'th',
    name: 'Thai',
    endonym: 'ไทย',
    script: 'Thai',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'd MMM y',
    weekStartsOn: 0,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'fil',
    name: 'Filipino',
    endonym: 'Filipino',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'MMM d, y',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'zh-Hans',
    name: 'Chinese (Simplified)',
    endonym: '简体中文',
    script: 'Hans',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'y/M/d',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'zh-Hant',
    name: 'Chinese (Traditional)',
    endonym: '繁體中文',
    script: 'Hant',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'y/M/d',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
  {
    bcp47: 'ja',
    name: 'Japanese',
    endonym: '日本語',
    script: 'Jpan',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'y/M/d',
    weekStartsOn: 0,
    hourCycle: 'h23',
    status: 'planned',
  },
  {
    bcp47: 'ko',
    name: 'Korean',
    endonym: '한국어',
    script: 'Kore',
    direction: 'ltr',
    pluralCategories: ['other'],
    defaultDateFormat: 'y. M. d.',
    weekStartsOn: 0,
    hourCycle: 'h12',
    status: 'planned',
  },
] as const satisfies readonly LocaleDescriptor[];

/** Every locale in the plan, active and planned. */
export const ALL_LOCALES: readonly LocaleDescriptor[] = LOCALE_LIST;

/** Union of every planned BCP-47 tag. */
export type LocaleCode = (typeof LOCALE_LIST)[number]['bcp47'];

/** The controlling locale. Every fallback ends here. */
export const DEFAULT_LOCALE = 'en';

const BY_LOWER_CASE_CODE = new Map<string, LocaleDescriptor>(
  LOCALE_LIST.map((locale) => [locale.bcp47.toLowerCase(), locale]),
);

/** Locales enabled in the product right now. */
export const ACTIVE_LOCALES: readonly LocaleDescriptor[] = LOCALE_LIST.filter(
  (locale) => locale.status === 'active',
);

/** Locales with real metadata but no reviewed catalog yet. */
export const PLANNED_LOCALES: readonly LocaleDescriptor[] = LOCALE_LIST.filter(
  (locale) => locale.status === 'planned',
);

export const ACTIVE_LOCALE_CODES: readonly string[] = ACTIVE_LOCALES.map((locale) => locale.bcp47);

export const ALL_LOCALE_CODES: readonly string[] = LOCALE_LIST.map((locale) => locale.bcp47);

/**
 * Legacy, macro and region tags that must route to a locale we ship.
 * Keys are lower case. Values are registry codes.
 */
const LOCALE_ALIASES: Readonly<Record<string, string>> = {
  in: 'id',
  iw: 'he',
  ji: 'he',
  tl: 'fil',
  no: 'nb',
  nn: 'nb',
  'no-nb': 'nb',
  pt: 'pt-BR',
  zh: 'zh-Hans',
  'zh-cn': 'zh-Hans',
  'zh-sg': 'zh-Hans',
  'zh-my': 'zh-Hans',
  'zh-chs': 'zh-Hans',
  'zh-tw': 'zh-Hant',
  'zh-hk': 'zh-Hant',
  'zh-mo': 'zh-Hant',
  'zh-cht': 'zh-Hant',
  cmn: 'zh-Hans',
  yue: 'zh-Hant',
};

/** Spanish speaking regions that prefer the Latin American catalog. */
const SPANISH_LATIN_AMERICAN_REGIONS: ReadonlySet<string> = new Set([
  'ar',
  'bo',
  'cl',
  'co',
  'cr',
  'cu',
  'do',
  'ec',
  'gt',
  'hn',
  'mx',
  'ni',
  'pa',
  'pe',
  'pr',
  'py',
  'sv',
  'us',
  'uy',
  've',
  '419',
]);

/** Lookup a locale descriptor by exact tag, case insensitively. */
export function getLocale(code: string): LocaleDescriptor | undefined {
  return BY_LOWER_CASE_CODE.get(code.trim().toLowerCase());
}

/** Throwing variant for code paths that already validated the tag. */
export function requireLocale(code: string): LocaleDescriptor {
  const locale = getLocale(code);
  if (!locale) {
    throw new Error(`Unknown locale tag: ${code}`);
  }
  return locale;
}

/** True when the locale is written right to left. Unknown tags are ltr. */
export function isRtl(code: string): boolean {
  const locale = getLocale(code);
  if (locale) {
    return locale.direction === 'rtl';
  }
  return isRtlScriptTag(code);
}

/** Direction for a tag, including tags outside the registry. */
export function getDirection(code: string): TextDirection {
  return isRtl(code) ? 'rtl' : 'ltr';
}

const RTL_LANGUAGE_SUBTAGS: ReadonlySet<string> = new Set([
  'ar',
  'arc',
  'ckb',
  'dv',
  'fa',
  'he',
  'ks',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]);

const RTL_SCRIPT_SUBTAGS: ReadonlySet<string> = new Set([
  'arab',
  'hebr',
  'nkoo',
  'syrc',
  'thaa',
  'adlm',
]);

function isRtlScriptTag(code: string): boolean {
  const subtags = code.trim().toLowerCase().split(/[-_]/);
  const language = subtags[0];
  if (language !== undefined && RTL_LANGUAGE_SUBTAGS.has(language)) {
    return true;
  }
  return subtags.some((subtag) => RTL_SCRIPT_SUBTAGS.has(subtag));
}

/** Cardinal plural categories reported by the runtime for a locale. */
export function getCardinalPluralCategories(code: string): readonly PluralCategory[] {
  try {
    const categories = new Intl.PluralRules(code).resolvedOptions().pluralCategories;
    return categories as readonly PluralCategory[];
  } catch {
    return ['other'];
  }
}

interface AcceptLanguageEntry {
  readonly tag: string;
  readonly quality: number;
  readonly order: number;
}

/** Parse an `Accept-Language` header into tags ordered by preference. */
export function parseAcceptLanguage(header: string | null | undefined): readonly string[] {
  if (!header) {
    return [];
  }
  const entries: AcceptLanguageEntry[] = [];
  const parts = header.split(',');
  for (let index = 0; index < parts.length; index += 1) {
    const raw = parts[index];
    if (raw === undefined) {
      continue;
    }
    const segments = raw.trim().split(';');
    const tag = segments[0]?.trim();
    if (!tag) {
      continue;
    }
    let quality = 1;
    for (let s = 1; s < segments.length; s += 1) {
      const segment = segments[s]?.trim();
      if (segment === undefined || !segment.toLowerCase().startsWith('q=')) {
        continue;
      }
      const parsed = Number.parseFloat(segment.slice(2));
      if (Number.isFinite(parsed)) {
        quality = Math.min(Math.max(parsed, 0), 1);
      }
    }
    if (quality > 0) {
      entries.push({ tag, quality, order: index });
    }
  }
  entries.sort((a, b) => (b.quality === a.quality ? a.order - b.order : b.quality - a.quality));
  return entries.map((entry) => entry.tag);
}

function normalizeTag(tag: string): string {
  return tag.trim().replace(/_/g, '-').toLowerCase();
}

/** Apply legacy, macro and regional aliases before lookup. */
export function canonicalizeLocaleTag(tag: string): string {
  const normalized = normalizeTag(tag);
  const alias = LOCALE_ALIASES[normalized];
  if (alias !== undefined) {
    return alias;
  }
  const subtags = normalized.split('-');
  const language = subtags[0] ?? '';
  if (language === 'es') {
    const region = subtags[subtags.length - 1];
    if (region !== undefined && SPANISH_LATIN_AMERICAN_REGIONS.has(region)) {
      return 'es-419';
    }
    return 'es';
  }
  if (language === 'pt') {
    const region = subtags[1];
    return region === 'pt' ? 'pt-PT' : 'pt-BR';
  }
  const languageAlias = LOCALE_ALIASES[language];
  if (languageAlias !== undefined && subtags.length === 1) {
    return languageAlias;
  }
  return normalized;
}

function findSupported(candidate: string, supportedLower: ReadonlyMap<string, string>): string | undefined {
  return supportedLower.get(candidate.toLowerCase());
}

/**
 * BCP-47 lookup with truncation and a language level fallback.
 *
 * Order of preference for each requested tag:
 *  1. exact match, case insensitive
 *  2. canonical alias match, for example `zh-TW` to `zh-Hant`
 *  3. progressive subtag truncation, `fr-CA-x-foo` to `fr-CA` to `fr`
 *  4. any supported locale sharing the language subtag, `pt` to `pt-BR`
 *
 * Returns `fallback` when nothing matches. `*` selects the first supported tag.
 */
export function resolveLocale(
  acceptLanguage: string | null | undefined,
  supported: readonly string[] = ACTIVE_LOCALE_CODES,
  fallback: string = DEFAULT_LOCALE,
): string {
  if (supported.length === 0) {
    return fallback;
  }
  const supportedLower = new Map<string, string>();
  for (const tag of supported) {
    supportedLower.set(tag.toLowerCase(), tag);
  }

  const requested = parseAcceptLanguage(acceptLanguage);
  for (const rawTag of requested) {
    if (rawTag === '*') {
      return supported[0] ?? fallback;
    }
    const normalized = normalizeTag(rawTag);

    const exact = findSupported(normalized, supportedLower);
    if (exact !== undefined) {
      return exact;
    }

    const canonical = canonicalizeLocaleTag(rawTag);
    const canonicalMatch = findSupported(canonical, supportedLower);
    if (canonicalMatch !== undefined) {
      return canonicalMatch;
    }

    const subtags = canonical.toLowerCase().split('-');
    for (let length = subtags.length - 1; length >= 1; length -= 1) {
      const truncated = subtags.slice(0, length).join('-');
      const match = findSupported(truncated, supportedLower);
      if (match !== undefined) {
        return match;
      }
    }

    const language = subtags[0];
    if (language !== undefined) {
      for (const tag of supported) {
        const tagLanguage = normalizeTag(tag).split('-')[0];
        if (tagLanguage === language) {
          return tag;
        }
      }
    }
  }

  return fallback;
}

/** Whether a tag is currently switched on in the product. */
export function isActiveLocale(code: string): boolean {
  return getLocale(code)?.status === 'active';
}
