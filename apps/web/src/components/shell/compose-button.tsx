'use client';

import Link from 'next/link';
import { PenLine } from 'lucide-react';

import { Button, Tooltip } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';

/**
 * Compose is a persistent primary action, not a navigation destination.
 *
 * When the workspace is read only, or the role cannot publish, the control is
 * disabled with the reason in a tooltip and in a visually hidden description,
 * so the reason is available without hovering.
 */
export function ComposeButton({ className }: { readonly className?: string }) {
  const t = useTranslations();
  const { canPublish, workspace } = useSession();

  if (!canPublish) {
    const reason = workspace.readOnly
      ? t('permission.readOnly')
      : t('permission.denied.role', { role: t('nav.compose'), currentRole: workspace.role });

    return (
      <Tooltip content={reason}>
        <span className={cn('inline-flex', className)}>
          <Button variant="primary" size="md" disabled aria-describedby="compose-disabled-reason">
            <PenLine aria-hidden="true" className="size-4" />
            {t('nav.compose')}
          </Button>
          <span id="compose-disabled-reason" className="sr-only">
            {reason}
          </span>
        </span>
      </Tooltip>
    );
  }

  return (
    <Button variant="primary" size="md" className={className} asChild>
      <Link href="/compose">
        <PenLine aria-hidden="true" className="size-4" />
        {t('nav.compose')}
      </Link>
    </Button>
  );
}
