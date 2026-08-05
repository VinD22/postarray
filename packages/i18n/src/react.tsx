/**
 * A minimal React binding.
 *
 * Deliberately small: a context, a hook and a `Trans` component. The web app
 * layers `next-intl` on top of this for routing and server components, so this
 * file must not know about any framework. React is an optional peer dependency,
 * which is why nothing here is re-exported from the package root.
 */

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react';

import { getDirection, type TextDirection } from './locales';
import type { MessageKey, PartialCatalog } from './messages/index';
import {
  createTranslator,
  type MessageArguments,
  type MessageValues,
  type MissingMessageReporter,
  type Translator,
} from './translate';

export interface I18nContextValue {
  readonly locale: string;
  readonly direction: TextDirection;
  /** IANA time zone every date on the screen is rendered in. */
  readonly timeZone: string;
  readonly translator: Translator;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  readonly locale: string;
  readonly catalog: PartialCatalog;
  /** IANA zone for this workspace or user. Never the browser zone by default. */
  readonly timeZone: string;
  readonly reporter?: MissingMessageReporter;
  readonly fallbackCatalog?: PartialCatalog;
  readonly children: ReactNode;
}

export function I18nProvider(props: I18nProviderProps): ReactElement {
  const { locale, catalog, timeZone, reporter, fallbackCatalog, children } = props;
  const value = useMemo<I18nContextValue>(() => {
    const translator = createTranslator(locale, catalog, {
      ...(reporter ? { reporter } : {}),
      ...(fallbackCatalog ? { fallbackCatalog } : {}),
    });
    return { locale, direction: getDirection(locale), timeZone, translator };
  }, [locale, catalog, timeZone, reporter, fallbackCatalog]);

  return createElement(I18nContext.Provider, { value }, children);
}

/** The active locale, direction, time zone and translator. */
export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18n must be used inside an I18nProvider');
  }
  return value;
}

export interface NamespaceTranslator {
  /** Format a key inside the namespace. */
  (key: string, values?: MessageValues): string;
  /** Format a fully qualified key, type checked against the catalog. */
  readonly full: <K extends MessageKey>(key: K, ...args: MessageArguments<K>) => string;
  readonly locale: string;
  readonly direction: TextDirection;
  readonly timeZone: string;
}

/**
 * Scope a component to one namespace.
 *
 * `const t = useTranslations('composer.schedule'); t('title')`
 *
 * The namespace is a prefix, not a lookup into a nested object, so the catalog
 * stays flat and a key never moves when a screen is reorganised.
 */
export function useTranslations(namespace?: string): NamespaceTranslator {
  const { translator, locale, direction, timeZone } = useI18n();
  const prefix = namespace ? (namespace.endsWith('.') ? namespace : `${namespace}.`) : '';

  const scoped = useCallback(
    (key: string, values?: MessageValues) => translator.format(`${prefix}${key}`, values),
    [translator, prefix],
  );

  return useMemo(() => {
    const fn = scoped as NamespaceTranslator & {
      full: NamespaceTranslator['full'];
      locale: string;
      direction: TextDirection;
      timeZone: string;
    };
    fn.full = ((key: MessageKey, values?: MessageValues) =>
      translator.format(key, values)) as NamespaceTranslator['full'];
    fn.locale = locale;
    fn.direction = direction;
    fn.timeZone = timeZone;
    return fn;
  }, [scoped, translator, locale, direction, timeZone]);
}

export interface TransProps {
  /** Fully qualified message key. */
  readonly id: MessageKey;
  readonly values?: MessageValues;
  /**
   * Rich elements by tag name. A message written as
   * `Read the <link>capability page</link> before you rely on it.` renders with
   * `{ link: (chunks) => <a href="...">{chunks}</a> }`.
   */
  readonly elements?: Readonly<Record<string, (chunks: ReactNode) => ReactNode>>;
}

const TAG_PATTERN = /<([a-zA-Z][a-zA-Z0-9]*)>([\s\S]*?)<\/\1>/;

/**
 * Render a message that contains rich elements.
 *
 * The message is formatted first, then the tags in the result are replaced.
 * Doing it in that order means the translator sees one whole sentence with the
 * markup inline, and we never concatenate two translated fragments.
 */
export function Trans(props: TransProps): ReactElement {
  const { id, values, elements } = props;
  const { translator } = useI18n();
  const formatted = translator.format(id, values);
  const children = elements ? interpolateElements(formatted, elements) : [formatted];
  return createElement('span', null, ...children.map(keyed));
}

function keyed(node: ReactNode, index: number): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  return createElement('span', { key: `part-${index}` }, node);
}

function interpolateElements(
  text: string,
  elements: Readonly<Record<string, (chunks: ReactNode) => ReactNode>>,
): ReactNode[] {
  const output: ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const match = TAG_PATTERN.exec(remaining);
    if (!match) {
      output.push(remaining);
      break;
    }
    const whole = match[0];
    const tag = match[1];
    const inner = match[2] ?? '';
    if (match.index > 0) {
      output.push(remaining.slice(0, match.index));
    }
    const render = tag === undefined ? undefined : elements[tag];
    if (render) {
      output.push(render(inner));
    } else {
      // An unknown tag renders its text. A user never sees raw markup.
      output.push(inner);
    }
    remaining = remaining.slice(match.index + whole.length);
  }

  return output;
}

/** Direction aware attributes for the document or a subtree. */
export function useDirectionAttributes(): { readonly dir: TextDirection; readonly lang: string } {
  const { locale, direction } = useI18n();
  return { dir: direction, lang: locale };
}
