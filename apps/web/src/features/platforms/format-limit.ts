import { formatBytes, formatDuration, formatList } from '@relay/i18n';
import type { Translator } from '@relay/i18n/translate';

import type { LimitValue } from './view-model';

/**
 * Turn one generated limit into a sentence in the reader locale.
 *
 * Kept out of the page so the page has no branching over data shapes and no
 * opportunity to write a number of its own. Every branch either formats a
 * value that came from the dataset or returns the shared `common.unavailable`
 * string. There is no branch that produces a zero for missing data.
 */
export function formatLimitValue(value: LimitValue, t: Translator, locale: string): string {
  switch (value.kind) {
    case 'unavailable':
      return t.t('common.unavailable');
    case 'message':
      return value.count === undefined
        ? t.format(value.key)
        : t.format(value.key, { count: value.count });
    case 'characters':
      return t.t('web.schedule.value.characters', { count: value.count });
    case 'files':
      return t.t('web.schedule.value.files', { count: value.count });
    case 'bytes':
      return formatBytes(locale, value.bytes);
    case 'seconds': {
      const max = formatDuration(locale, value.max * 1000, { style: 'long' });
      if (value.min === null) {
        return t.t('web.schedule.value.durationMax', { max });
      }
      return t.t('web.schedule.value.durationRange', {
        min: formatDuration(locale, value.min * 1000, { style: 'long' }),
        max,
      });
    }
    case 'list':
      return formatList(locale, [...value.items]);
  }
}
