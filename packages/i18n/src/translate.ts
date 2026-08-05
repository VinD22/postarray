/**
 * The ICU runtime.
 *
 * Guarantees, in order of importance:
 *  1. A user never sees a raw key. Not for a missing translation, not for a
 *     missing parameter, not for a malformed message.
 *  2. A user never sees a half interpolated string. If a message cannot be
 *     formatted, its literal text is shown with the arguments removed.
 *  3. Every fallback is reported once per key per locale, so CI and production
 *     telemetry can see the gap without flooding the logs.
 */

import { IntlMessageFormat } from 'intl-messageformat';

import { stripArguments } from './icu';
import { en } from './messages/en/index';
import type { MessageKey, PartialCatalog } from './messages/index';
import { DEFAULT_LOCALE } from './locales';

export type { MessageKey, PartialCatalog };

/** Values an ICU argument accepts. */
export type MessageValue = string | number | boolean | Date | null | undefined;

export type MessageValues = Readonly<Record<string, MessageValue>>;

/** True when the English source for this key contains any ICU argument. */
export type HasArguments<S extends string> = S extends `${string}{${string}` ? true : false;

/**
 * Parameters for a key.
 *
 * A message with no ICU argument takes no values, and a message that has one
 * requires them. Full per argument typing is deliberately not attempted: the
 * template literal recursion needed to name every argument of a catalog this
 * size is slower to compile than it is worth, and a missing or misspelled
 * argument is already caught at runtime by the reporter below, which falls back
 * rather than rendering a broken string.
 */
export type MessageArguments<K extends MessageKey> =
  HasArguments<(typeof en)[K]> extends true ? [values: MessageValues] : [values?: MessageValues];

export type MissingMessageReason =
  'missing-translation' | 'unknown-key' | 'parse-error' | 'format-error';

export interface MissingMessageReport {
  readonly key: string;
  readonly locale: string;
  readonly reason: MissingMessageReason;
  /** Sanitized detail. Never contains user content or argument values. */
  readonly detail?: string;
}

export type MissingMessageReporter = (report: MissingMessageReport) => void;

/** Discards reports. The default in production so a gap never breaks a render. */
export const silentReporter: MissingMessageReporter = () => undefined;

/** Collects reports for tests and for the CI catalog check. */
export function createCollectingReporter(): MissingMessageReporter & {
  readonly reports: readonly MissingMessageReport[];
} {
  const reports: MissingMessageReport[] = [];
  const reporter = ((report: MissingMessageReport) => {
    reports.push(report);
  }) as MissingMessageReporter & { reports: MissingMessageReport[] };
  reporter.reports = reports;
  return reporter;
}

export interface TranslatorOptions {
  /** Where missing keys and format failures are reported. Once per key. */
  readonly reporter?: MissingMessageReporter;
  /** The catalog used when the active one has no entry. Defaults to English. */
  readonly fallbackCatalog?: PartialCatalog;
  /** Locale used to format the fallback message. Defaults to `en`. */
  readonly fallbackLocale?: string;
}

export interface Translator {
  readonly locale: string;
  /** Format a message. Never throws, never renders a key. */
  t<K extends MessageKey>(key: K, ...args: MessageArguments<K>): string;
  /** True when the active catalog has its own translation for this key. */
  has(key: MessageKey): boolean;
  /** Format an unchecked key, for codes resolved at runtime. */
  format(key: string, values?: MessageValues): string;
}

type CompiledMessage = {
  readonly format: (values?: MessageValues) => string;
  readonly source: string;
};

const ENGLISH_CATALOG = en as PartialCatalog;

/**
 * Create a translator bound to one locale and one catalog.
 *
 * The catalog may be partial. Anything it does not define falls back to the
 * English source, which is always complete because `MessageKey` is derived
 * from it.
 */
export function createTranslator(
  locale: string,
  catalog: PartialCatalog,
  options: TranslatorOptions = {},
): Translator {
  const reporter = options.reporter ?? silentReporter;
  const fallbackCatalog = options.fallbackCatalog ?? ENGLISH_CATALOG;
  const fallbackLocale = options.fallbackLocale ?? DEFAULT_LOCALE;
  const compiled = new Map<string, CompiledMessage | null>();
  const reported = new Set<string>();

  const report = (key: string, reason: MissingMessageReason, detail?: string): void => {
    const fingerprint = `${reason}:${key}`;
    if (reported.has(fingerprint)) {
      return;
    }
    reported.add(fingerprint);
    reporter(detail === undefined ? { key, locale, reason } : { key, locale, reason, detail });
  };

  const compile = (
    key: string,
    source: string,
    messageLocale: string,
    cacheKey: string,
  ): CompiledMessage | null => {
    const cached = compiled.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
    try {
      const message = new IntlMessageFormat(source, messageLocale, undefined, {
        ignoreTag: false,
      });
      const entry: CompiledMessage = {
        source,
        format: (values) => String(message.format(values as never)),
      };
      compiled.set(cacheKey, entry);
      return entry;
    } catch (error) {
      compiled.set(cacheKey, null);
      report(key, 'parse-error', errorName(error));
      return null;
    }
  };

  const formatKey = (key: string, values?: MessageValues): string => {
    const own = (catalog as Record<string, string | undefined>)[key];
    const english = (fallbackCatalog as Record<string, string | undefined>)[key];

    if (own === undefined && english === undefined) {
      report(key, 'unknown-key');
      return '';
    }

    if (own !== undefined) {
      const message = compile(key, own, locale, `${locale}:${key}`);
      if (message) {
        try {
          return message.format(values);
        } catch (error) {
          report(key, 'format-error', errorName(error));
        }
      }
    } else {
      report(key, 'missing-translation');
    }

    if (english !== undefined) {
      const message = compile(key, english, fallbackLocale, `${fallbackLocale}:${key}`);
      if (message) {
        try {
          return message.format(values);
        } catch (error) {
          report(key, 'format-error', errorName(error));
        }
      }
      // Last resort: the sentence without its arguments. Readable, never broken.
      return stripArguments(english);
    }

    return own === undefined ? '' : stripArguments(own);
  };

  return {
    locale,
    t(key, ...args) {
      const [values] = args as [MessageValues | undefined];
      return formatKey(key, values);
    },
    has(key) {
      return (catalog as Record<string, string | undefined>)[key] !== undefined;
    },
    format(key, values) {
      return formatKey(key, values);
    },
  };
}

function errorName(error: unknown): string {
  if (error instanceof Error) {
    return error.name;
  }
  return 'Error';
}

/**
 * A translator scoped to a namespace, so a component asks for `title` rather
 * than `composer.schedule.title`.
 */
export function scopeTranslator(
  translator: Translator,
  namespace: string,
): (key: string, values?: MessageValues) => string {
  const prefix = namespace.endsWith('.') ? namespace : `${namespace}.`;
  return (key, values) => translator.format(`${prefix}${key}`, values);
}
