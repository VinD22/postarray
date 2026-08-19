import type { MessageKey } from '@relay/i18n/translate';

import type { ProviderLimits } from '@/features/marketing/data/publishing-limits-types';
import type { LimitValue } from '@/features/platforms/view-model';

/**
 * The constraints the `/specs` cluster publishes a page for.
 *
 * One constraint is one question a person types into a search engine: how long
 * can the text be, how big can the picture be, how many images fit on a post.
 * Each entry owns the copy keys for that question and, more importantly, the
 * single function that decides whether this platform has an answer at all.
 *
 * `resolve` returns `null` whenever the generated dataset has nothing to say,
 * and the registry turns that `null` into "no page". That is the rule the
 * whole cluster rests on: a page exists because a value exists, so there is no
 * code path that can render a ceiling nobody recorded. `null` covers three
 * cases and they are deliberately treated the same way:
 *
 *  - the provider ships no adapter in this build, so the whole block is null;
 *  - the platform documents no ceiling for this field, so the field is null;
 *  - the field is a count and the count is zero, which means the platform
 *    accepts none of that thing. "How many images fit on one post" has no
 *    subject on a platform that takes no images, and a page answering it with
 *    a zero is exactly the fabricated-limit page this cluster must not print.
 *
 * Nothing in this file states a number, a platform name or a URL. Every value
 * on a rendered page comes back out of `ProviderLimits`.
 */

export const SPEC_CONSTRAINT_SLUGS = [
  'character-limit',
  'title-limit',
  'image-size',
  'video-size',
  'video-length',
  'image-count',
  'alt-text-limit',
  'file-types',
] as const;

export type SpecConstraintSlug = (typeof SPEC_CONSTRAINT_SLUGS)[number];

export interface SpecConstraint {
  /** URL segment, and the stable identity of the constraint. */
  readonly slug: SpecConstraintSlug;
  /** Short label, used in lists and table rows. Carries no platform name. */
  readonly nameKey: MessageKey;
  /** Page heading and document title. Takes `{platform}`. */
  readonly titleKey: MessageKey;
  /** Standfirst. Takes `{platform}`. */
  readonly ledeKey: MessageKey;
  /** Meta description. Takes `{platform}`. */
  readonly descriptionKey: MessageKey;
  /** The dataset value, or `null` when this platform has none recorded. */
  readonly resolve: (limits: ProviderLimits) => LimitValue | null;
}

/** A count is an answer only when the platform accepts at least one. */
function positiveCount(value: number | null | undefined): LimitValue | null {
  return value === null || value === undefined || value <= 0
    ? null
    : { kind: 'files', count: value };
}

function characters(value: number | null | undefined): LimitValue | null {
  return value === null || value === undefined ? null : { kind: 'characters', count: value };
}

function bytes(value: number | null | undefined): LimitValue | null {
  return value === null || value === undefined ? null : { kind: 'bytes', bytes: value };
}

export const SPEC_CONSTRAINTS: readonly SpecConstraint[] = [
  {
    slug: 'character-limit',
    nameKey: 'web.specs.constraint.characterLimit.name',
    titleKey: 'web.specs.constraint.characterLimit.title',
    ledeKey: 'web.specs.constraint.characterLimit.lede',
    descriptionKey: 'web.specs.constraint.characterLimit.description',
    resolve: (limits) => characters(limits.text?.maxLength),
  },
  {
    slug: 'title-limit',
    nameKey: 'web.specs.constraint.titleLimit.name',
    titleKey: 'web.specs.constraint.titleLimit.title',
    ledeKey: 'web.specs.constraint.titleLimit.lede',
    descriptionKey: 'web.specs.constraint.titleLimit.description',
    resolve: (limits) => characters(limits.maxTitleLength),
  },
  {
    slug: 'image-size',
    nameKey: 'web.specs.constraint.imageSize.name',
    titleKey: 'web.specs.constraint.imageSize.title',
    ledeKey: 'web.specs.constraint.imageSize.lede',
    descriptionKey: 'web.specs.constraint.imageSize.description',
    resolve: (limits) => bytes(limits.media?.maxImageBytes),
  },
  {
    slug: 'video-size',
    nameKey: 'web.specs.constraint.videoSize.name',
    titleKey: 'web.specs.constraint.videoSize.title',
    ledeKey: 'web.specs.constraint.videoSize.lede',
    descriptionKey: 'web.specs.constraint.videoSize.description',
    resolve: (limits) => bytes(limits.media?.maxVideoBytes),
  },
  {
    slug: 'video-length',
    nameKey: 'web.specs.constraint.videoLength.name',
    titleKey: 'web.specs.constraint.videoLength.title',
    ledeKey: 'web.specs.constraint.videoLength.lede',
    descriptionKey: 'web.specs.constraint.videoLength.description',
    resolve: (limits) => {
      const media = limits.media;
      if (media === null || media.maxDurationSeconds === null) {
        return null;
      }
      return { kind: 'seconds', max: media.maxDurationSeconds, min: media.minDurationSeconds };
    },
  },
  {
    slug: 'image-count',
    nameKey: 'web.specs.constraint.imageCount.name',
    titleKey: 'web.specs.constraint.imageCount.title',
    ledeKey: 'web.specs.constraint.imageCount.lede',
    descriptionKey: 'web.specs.constraint.imageCount.description',
    resolve: (limits) => positiveCount(limits.media?.maxImages),
  },
  {
    slug: 'alt-text-limit',
    nameKey: 'web.specs.constraint.altTextLimit.name',
    titleKey: 'web.specs.constraint.altTextLimit.title',
    ledeKey: 'web.specs.constraint.altTextLimit.lede',
    descriptionKey: 'web.specs.constraint.altTextLimit.description',
    resolve: (limits) => characters(limits.media?.maxAltTextLength),
  },
  {
    slug: 'file-types',
    nameKey: 'web.specs.constraint.fileTypes.name',
    titleKey: 'web.specs.constraint.fileTypes.title',
    ledeKey: 'web.specs.constraint.fileTypes.lede',
    descriptionKey: 'web.specs.constraint.fileTypes.description',
    resolve: (limits) => {
      const types = limits.media?.allowedMimeTypes ?? [];
      return types.length === 0 ? null : { kind: 'list', items: types };
    },
  },
];

const BY_SLUG = new Map(SPEC_CONSTRAINTS.map((constraint) => [constraint.slug, constraint]));

export function findSpecConstraint(slug: string): SpecConstraint | undefined {
  return BY_SLUG.get(slug as SpecConstraintSlug);
}
