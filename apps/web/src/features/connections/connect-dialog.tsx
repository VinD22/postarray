'use client';

/**
 * The connect flow, before the OAuth handoff.
 *
 * Two things happen here that must happen before a person leaves for the
 * provider, not after:
 *
 *  1. The exact permissions being requested are listed, each with what Relay
 *     uses it for. A consent screen that says "manage your pages" is the
 *     provider's sentence; this is ours.
 *  2. The account type requirement is stated up front. Instagram publishing
 *     needs a professional account and Facebook targets Pages rather than
 *     personal profiles. Learning that after a failed OAuth round trip wastes
 *     somebody's afternoon and reads as a broken product.
 */

import { useState, type ReactNode } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Notice,
  RadioGroup,
  RadioGroupItem,
  cn,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { ProviderMark, useProviderName } from './provider';
import type { PermissionView } from './types';
import type { ProviderId } from '@/lib/api/types';

/**
 * Providers a person can connect, and the requirement sentence each one needs
 * before the handoff. `fake` is the in-repo simulator and is not offered.
 */
export const CONNECTABLE_PROVIDERS: readonly ProviderId[] = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
];

const REQUIREMENT_KEY: Readonly<Record<ProviderId, string>> = {
  x: 'web.connection.requirement.x',
  linkedin: 'web.connection.requirement.linkedin',
  instagram: 'web.connection.requirement.instagram',
  facebook: 'web.connection.requirement.facebook',
  youtube: 'web.connection.requirement.youtube',
  tiktok: 'web.connection.requirement.tiktok',
  threads: 'web.connection.requirement.threads',
  bluesky: 'web.connection.requirement.bluesky',
  fake: 'web.connection.requirement.generic',
};

export interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Scopes for the selected provider, from `getCapabilities`. */
  permissionsByProvider: Readonly<Record<string, readonly PermissionView[]>>;
  starting: boolean;
  onBegin: (provider: ProviderId) => void;
}

export function ConnectDialog({
  open,
  onOpenChange,
  permissionsByProvider,
  starting,
  onBegin,
}: ConnectDialogProps): ReactNode {
  const t = useTranslations();
  const providerName = useProviderName();
  const [provider, setProvider] = useState<ProviderId>('x');

  const permissions = permissionsByProvider[provider] ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="lg">
        <DialogHeader>
          <DialogTitle>{t('web.connection.connect.title')}</DialogTitle>
          <DialogDescription>
            {t('connection.permissions.explainBeforeOAuth', {
              provider: providerName(provider),
            })}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-label text-text-tertiary pb-1">
                {t('web.connection.connect.chooseProvider')}
              </legend>
              <RadioGroup
                value={provider}
                onValueChange={(next) => setProvider(next as ProviderId)}
                className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
              >
                {CONNECTABLE_PROVIDERS.map((candidate) => (
                  <div
                    key={candidate}
                    className={cn(
                      'flex min-h-11 items-center gap-2 rounded-md border p-2.5',
                      candidate === provider
                        ? 'border-accent bg-accent-subtle'
                        : 'border-border-default bg-surface-raised',
                    )}
                  >
                    <RadioGroupItem id={`connect-${candidate}`} value={candidate} />
                    <ProviderMark provider={candidate} />
                    <Label
                      htmlFor={`connect-${candidate}`}
                      className="text-body-md text-text-primary"
                    >
                      {providerName(candidate)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>

            <Notice
              tone="warning"
              title={t('web.connection.connect.requirementHeading')}
              description={t(REQUIREMENT_KEY[provider])}
            />

            <section className="flex flex-col gap-2">
              <h3 className="text-title-sm text-text-primary">
                {t('web.connection.connect.permissionHeading', {
                  provider: providerName(provider),
                })}
              </h3>

              {permissions.length === 0 ? (
                <p className="text-body-md text-text-secondary">{t('common.unavailable')}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {permissions.map((permission) => (
                    <li
                      key={permission.scope}
                      className="border-border-subtle bg-surface-sunken flex gap-2 rounded-md border p-2.5"
                    >
                      <ShieldCheck
                        aria-hidden="true"
                        className="text-text-tertiary mt-0.5 size-4 shrink-0"
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-code text-text-primary font-mono">
                          {permission.scope}
                        </span>
                        <span className="text-body-sm text-text-secondary">
                          {t(permission.purposeKey)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-body-sm text-text-secondary">
                {t('web.connection.connect.noWriteWithoutApproval')}
              </p>
              <p className="text-body-sm text-text-tertiary">
                {t('web.connection.connect.handoffNote', {
                  provider: providerName(provider),
                })}
              </p>
            </section>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="primary"
            loading={starting}
            loadingLabel={t('loading.connecting', { provider: providerName(provider) })}
            iconEnd={<ExternalLink aria-hidden="true" className="size-4" />}
            onClick={() => onBegin(provider)}
          >
            {t('web.connection.connect.continue', { provider: providerName(provider) })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
