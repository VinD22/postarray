'use client';

/**
 * Link controls.
 *
 * Three choices, always visible once the draft contains a URL: keep the
 * original, replace it with a tracked short link, and edit the UTM values. The
 * exact URL that will publish is printed here and repeated in every target
 * preview, because the only version of that string that matters is the one the
 * reader will click.
 */

import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Field,
  Input,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { RadioRow } from './form-rows';

/** Sentinel for "no branded domain". Radix forbids an empty option value. */
const RELAY_DOMAIN = 'relay-default';

export function LinkControls(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();
  const links = state.master.links;
  const verified = bootstrap.brandedDomains.filter((domain) => domain.verified);

  return (
    <section aria-labelledby="composer-links-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id="composer-links-heading" className="text-title-sm text-text-primary">
          {t.full('composerWeb.links.heading')}
        </h3>
        <span className="text-label text-text-tertiary">
          {links.length === 0
            ? t.full('composerWeb.links.noneDetected')
            : t.full('composerWeb.links.detected', { count: links.length })}
        </span>
      </div>

      {links.length === 0 ? null : (
        <>
          <RadioGroup
            value={state.linkPlan.mode}
            onValueChange={(value) =>
              dispatch({
                type: 'links/plan',
                plan: { mode: value === 'tracked' ? 'tracked' : 'original' },
              })
            }
            aria-label={t.full('composerWeb.links.modeLabel')}
            className="flex flex-col gap-2"
          >
            <RadioRow value="original" label={t.full('composer.links.keepOriginal')} />
            <RadioRow value="tracked" label={t.full('composer.links.track')} />
          </RadioGroup>

          {state.linkPlan.mode === 'tracked' ? (
            <Field label={t.full('composer.links.domain')}>
              {(control) => (
                <Select
                  value={state.linkPlan.brandedDomain ?? RELAY_DOMAIN}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'links/plan',
                      plan: { brandedDomain: value === RELAY_DOMAIN ? null : value },
                    })
                  }
                >
                  <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
                    <SelectValue placeholder={t.full('composerWeb.links.domainDefault')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RELAY_DOMAIN}>
                      {t.full('composerWeb.links.domainDefault')}
                    </SelectItem>
                    {verified.map((domain) => (
                      <SelectItem key={domain.domain} value={domain.domain}>
                        {t.full('composerWeb.links.domainVerified', { domain: domain.domain })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}

          <details className="border-border-subtle bg-surface-sunken group rounded-md border">
            <summary className="text-label text-text-secondary flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{t.full('composer.links.utm')}</span>
              <ChevronDown
                aria-hidden="true"
                className="text-text-tertiary size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
              />
            </summary>
            <fieldset className="border-border-subtle border-t p-3">
              <legend className="sr-only">{t.full('composer.links.utm')}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ['source', 'composerWeb.links.utmSource'],
                    ['medium', 'composerWeb.links.utmMedium'],
                    ['campaign', 'composerWeb.links.utmCampaign'],
                    ['term', 'composerWeb.links.utmTerm'],
                    ['content', 'composerWeb.links.utmContent'],
                  ] as const
                ).map(([key, labelKey]) => (
                  <Field key={key} label={t(labelKey)}>
                    {(control) => (
                      <Input
                        id={control.id}
                        value={state.linkPlan.utm[key] ?? ''}
                        onChange={(event) =>
                          dispatch({
                            type: 'links/plan',
                            plan: {
                              utm: {
                                ...state.linkPlan.utm,
                                [key]:
                                  event.target.value.length === 0 ? undefined : event.target.value,
                              },
                            },
                          })
                        }
                      />
                    )}
                  </Field>
                ))}
              </div>
            </fieldset>
          </details>

          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.originalUrl} className="flex flex-col gap-0.5">
                <span className="text-label text-text-tertiary">
                  {t.full('composerWeb.links.original')}
                </span>
                <span className="text-mono text-text-secondary font-mono break-all">
                  {link.originalUrl}
                </span>
                <span className="text-body-sm text-text-primary break-all">
                  {t.full('composer.links.finalUrl', {
                    url: link.publishedUrl ?? link.originalUrl,
                  })}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-body-sm text-text-tertiary">
            {t.full('composer.links.frozenAtApproval')}
          </p>
        </>
      )}
    </section>
  );
}
