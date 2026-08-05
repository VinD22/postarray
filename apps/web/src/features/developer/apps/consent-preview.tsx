'use client';

import type { ReactNode } from 'react';
import { Badge, Button, Code, Separator } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { Scope } from '@relay/contracts';
import { Check, Minus } from 'lucide-react';

import { scopeDescriptionKey, scopeGroups, withheldScopes } from '../lib/scope-groups.js';

export interface ConsentPreviewProps {
  appName: string;
  developerName: string;
  workspaceName: string;
  brandNames: readonly string[];
  scopes: readonly Scope[];
  homepageUrl: string;
  privacyUrl: string;
  termsUrl: string;
}

/**
 * What the person granting access actually sees.
 *
 * The two things this screen must never do: bundle a consequential permission
 * into a general one, and imply that granting access moves the approval
 * boundary. So read permissions and consequential permissions are separate
 * headed groups, every withheld permission is listed by name, and the approval
 * policy sentence sits above the allow button rather than in a footer.
 */
export function ConsentPreview({
  appName,
  developerName,
  workspaceName,
  brandNames,
  scopes,
  homepageUrl,
  privacyUrl,
  termsUrl,
}: ConsentPreviewProps): ReactNode {
  const t = useTranslations();
  const granted = scopeGroups(scopes);
  const withheld = withheldScopes(scopes);

  return (
    <div className="border-border-default bg-surface-raised flex flex-col gap-4 rounded-xl border p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="info">{t('developer.ui.apps.consentPreviewSample')}</Badge>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-title-sm text-text-primary">
          {t('developer.consent.title', { app: appName })}
        </h3>
        <p className="text-body-sm text-text-secondary">
          {t('developer.consent.developerIdentity', { developer: developerName })}
        </p>
        <p className="text-body-sm text-text-tertiary flex flex-wrap gap-x-3">
          <a
            className="underline underline-offset-2"
            href={homepageUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('developer.apps.homepage')}
          </a>
          <a
            className="underline underline-offset-2"
            href={privacyUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('developer.apps.privacyUrl')}
          </a>
          <a
            className="underline underline-offset-2"
            href={termsUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('developer.apps.termsUrl')}
          </a>
        </p>
      </div>

      <Separator />

      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(8rem,12rem)_1fr]">
        <dt className="text-label text-text-tertiary">{t('developer.consent.workspace')}</dt>
        <dd className="text-body-md text-text-primary">{workspaceName}</dd>
        <dt className="text-label text-text-tertiary">{t('developer.consent.brands')}</dt>
        <dd className="text-body-md text-text-primary">
          {brandNames.length === 0 ? t('common.all') : brandNames.join(', ')}
        </dd>
      </dl>

      <Separator />

      <section className="flex flex-col gap-4">
        <h4 className="text-body-md text-text-primary font-medium">
          {t('developer.consent.willBeAbleTo', { app: appName })}
        </h4>

        {granted.length === 0 ? (
          <p className="text-body-md text-text-secondary">{t('common.none')}</p>
        ) : (
          granted.map((group) => (
            <div key={group.risk} className="flex flex-col gap-1">
              <p className="text-label text-text-tertiary">{t(group.titleKey)}</p>
              <ul className="flex flex-col gap-1">
                {group.scopes.map((scope) => (
                  <li key={scope} className="text-body-md flex items-start gap-2">
                    <Check
                      aria-hidden="true"
                      className={
                        group.risk === 'consequential'
                          ? 'text-warning-fg mt-0.5 size-4 shrink-0'
                          : 'text-success-fg mt-0.5 size-4 shrink-0'
                      }
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-text-primary">{t(scopeDescriptionKey(scope))}</span>
                      <Code className="w-fit">{scope}</Code>
                    </span>
                  </li>
                ))}
              </ul>
              {group.risk === 'consequential' ? (
                <p className="text-body-sm text-warning-fg">{t(group.helpKey)}</p>
              ) : null}
            </div>
          ))
        )}
      </section>

      <section className="flex flex-col gap-1">
        <h4 className="text-body-md text-text-primary font-medium">
          {t('developer.consent.willNotBeAbleTo', { app: appName })}
        </h4>
        <ul className="flex flex-col gap-1">
          {withheld.map((scope) => (
            <li key={scope} className="text-body-md text-text-secondary flex items-start gap-2">
              <Minus aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
              <span>{t(scopeDescriptionKey(scope))}</span>
            </li>
          ))}
        </ul>
      </section>

      <Notice
        tone="neutral"
        title={t('developer.consent.approvalStillApplies')}
        description={t('developer.consent.revokeAnyTime')}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" disabled>
          {t('developer.consent.allow')}
        </Button>
        <Button variant="ghost" disabled>
          {t('developer.consent.deny')}
        </Button>
      </div>
    </div>
  );
}
