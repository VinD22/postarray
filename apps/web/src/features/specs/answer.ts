import { formatBytes, formatDuration, formatList } from '@relay/i18n';
import type { Translator } from '@relay/i18n/translate';

import { formatDate } from '@/features/marketing/i18n';
import type { LimitValue } from '@/features/platforms/view-model';

import type { SpecEntry } from './registry';

/**
 * The answer-first title and opening sentence for one recorded value.
 *
 * A reader who searched "X character limit" should find the number in the
 * result title, the description and the first sentence of the page, with the
 * date it was last read. The arguments are numbers and formatter output, never
 * a translated fragment, so each language owns its whole sentence.
 *
 * Returns `undefined` without a verified date: a value with no citation keeps
 * the plain title and lede rather than claiming a verification that did not
 * happen.
 */
export interface SpecAnswer {
  readonly title: string;
  readonly sentence: string;
}

function valueArguments(value: LimitValue, locale: string): Record<string, string | number> {
  switch (value.kind) {
    case 'characters':
    case 'files':
      return { count: value.count };
    case 'bytes':
      return { size: formatBytes(locale, value.bytes) };
    case 'seconds':
      return { max: formatDuration(locale, value.max * 1000, { style: 'long' }) };
    case 'list':
      return { items: formatList(locale, [...value.items]) };
    default:
      return {};
  }
}

export function specAnswer(input: {
  readonly entry: SpecEntry;
  readonly platformName: string;
  readonly readOn: string | undefined;
  readonly t: Translator;
  readonly locale: string;
}): SpecAnswer | undefined {
  const { entry, t, locale, readOn } = input;
  if (
    readOn === undefined ||
    entry.value.kind === 'unavailable' ||
    entry.value.kind === 'message'
  ) {
    return undefined;
  }
  const values = {
    platform: input.platformName,
    verified: formatDate(readOn, locale),
    ...valueArguments(entry.value, locale),
  };
  return {
    title: t.format(entry.constraint.answerTitleKey, values),
    sentence: t.format(entry.constraint.answerSentenceKey, values),
  };
}
