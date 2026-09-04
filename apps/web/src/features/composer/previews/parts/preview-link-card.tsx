'use client';

/**
 * The link preview card.
 *
 * It renders only where `presentation.linkCard` says the platform builds one,
 * and it shows only what we actually know: the address. Nothing in Post Array
 * fetches the destination page, so the headline, the description and the
 * picture a platform would pull from the destination's markup are absent here
 * and are said to be absent, rather than being approximated from the URL.
 */

import type { ReactNode } from 'react';
import { Link2 } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import type { PresentationRule, PreviewLink } from '../types';

export interface PreviewLinkCardProps {
  readonly link: PreviewLink;
  readonly presentation: PresentationRule;
}

export function PreviewLinkCard({ link, presentation }: PreviewLinkCardProps): ReactNode {
  const t = useTranslations();
  if (presentation.linkCard === null || link.domain.length === 0) {
    return null;
  }
  const large = presentation.linkCard === 'large';

  return (
    <div
      className={cn(
        'border-border-subtle bg-surface-sunken flex flex-col gap-1 rounded-md border',
        large ? 'p-3' : 'p-2',
      )}
    >
      <p className="text-label text-text-secondary flex items-center gap-1.5">
        <Link2 aria-hidden className="size-3.5" />
        <span className="truncate">{link.domain}</span>
      </p>
      {link.title === null ? null : (
        <p className="text-body-md text-text-primary">{link.title}</p>
      )}
      {link.description === null ? null : (
        <p className="text-body-sm text-text-secondary">{link.description}</p>
      )}
      {large && link.title === null ? (
        <p className="text-label text-text-tertiary">
          {t.full('composerWeb.preview.link.domainOnly')}
        </p>
      ) : null}
    </div>
  );
}
