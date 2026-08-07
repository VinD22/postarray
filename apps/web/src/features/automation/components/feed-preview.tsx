'use client';

import type { ReactElement } from 'react';
import { Badge } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useValueFormat } from '@/features/analytics/use-value-format';

import type { FeedField, FeedValidation } from '../rss-types';

/**
 * What the server actually found at that address.
 *
 * The preview exists so the user recognises the feed before anything is
 * scheduled from it: the title, the newest items, their timestamps and their
 * images. An item with no timestamp says so rather than being given today's
 * date, because a feed that omits dates will otherwise look freshly published
 * every time it is polled.
 *
 * The field list underneath is the honest input to the template editor. Offering
 * an author placeholder for a feed that has no authors produces posts with a
 * gap in them.
 */

const FIELD_KEY: Readonly<Record<FeedField, string>> = {
  title: 'automation.rss.templateField.title',
  summary: 'automation.rss.templateField.summary',
  link: 'automation.rss.templateField.link',
  author: 'automation.rss.templateField.author',
  published: 'automation.rss.templateField.published',
  categories: 'automation.rss.templateField.categories',
};

const ALL_FIELDS: readonly FeedField[] = [
  'title',
  'summary',
  'link',
  'author',
  'published',
  'categories',
];

export interface FeedPreviewProps {
  readonly validation: FeedValidation;
}

export function FeedPreview({ validation }: FeedPreviewProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  return (
    <section aria-labelledby="feed-preview-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 id="feed-preview-heading" className="text-title-sm text-text-primary">
          {t('automation.rss.previewTitle')}
        </h3>
        <p className="text-body-md text-text-secondary">
          {t('automation.rss.previewMeta', {
            title: validation.title,
            count: validation.itemCount,
          })}
        </p>
      </div>

      <ul className="border-border-subtle flex flex-col border-t">
        {validation.items.slice(0, 5).map((item) => (
          <li key={item.id} className="border-border-subtle flex gap-3 border-b py-3">
            {item.imageUrl ? (
              // A feed thumbnail is a remote URL from an arbitrary publisher. next/image
              // would require allowlisting every host a customer might subscribe to.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.imageAlt ?? t('automation.rss.previewImageAlt', { title: item.title })}
                className="border-border-subtle size-16 shrink-0 rounded-md border object-cover"
                loading="lazy"
              />
            ) : (
              <span className="border-border-default text-label text-text-tertiary flex size-16 shrink-0 items-center justify-center rounded-md border border-dashed p-1 text-center">
                {t('automation.rss.previewNoImage')}
              </span>
            )}

            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-body-md text-text-primary">{item.title}</span>
              {item.summary ? (
                <span className="text-body-sm text-text-secondary line-clamp-2">
                  {item.summary}
                </span>
              ) : null}
              <span className="text-body-sm text-text-tertiary">
                {item.publishedAt === null ? (
                  t('automation.rss.previewNoDate')
                ) : (
                  <time dateTime={item.publishedAt} className="tabular-nums">
                    {t('automation.rss.previewItemPublished', {
                      dateTime: format.dateTime(item.publishedAt),
                    })}
                  </time>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <h4 className="text-label text-text-tertiary">{t('automation.rss.previewFieldsTitle')}</h4>
        <ul className="flex flex-wrap gap-2">
          {ALL_FIELDS.map((field) => {
            const present = validation.availableFields.includes(field);
            return (
              <li key={field}>
                <Badge tone={present ? 'success' : 'neutral'}>
                  {t(FIELD_KEY[field])}
                  {present ? null : (
                    <span className="ps-1.5">{t('automation.rss.previewFieldMissing')}</span>
                  )}
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
