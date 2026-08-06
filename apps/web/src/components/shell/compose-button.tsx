'use client';

import { Link } from '@/components/link';
import { PenSquare } from 'lucide-react';

import { Button, Tooltip } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { Magnetic } from '@/components/motion';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';

/**
 * Compose is a persistent primary action, not a navigation destination.
 *
 * It is the shell's one loud control: the yellow `cta` slab, so it reads as
 * the single thing the top bar most wants you to do. `Magnetic` gives it a
 * subtle pointer-follow pull on fine-pointer devices only — it is an inert
 * passthrough on touch and under reduced motion (see `useMotionOk`).
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
          <Button variant="cta" size="md" disabled aria-describedby="compose-disabled-reason">
            <PenSquare aria-hidden="true" className="size-4" />
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
    <Magnetic strength={0.15} maxOffset={4} className={className}>
      <Button variant="cta" size="md" className="relay-compose-cta" asChild>
        <Link href="/compose">
          <PenSquare aria-hidden="true" className="size-4" />
          {t('nav.compose')}
        </Link>
      </Button>
    </Magnetic>
  );
}
