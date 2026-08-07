'use client';

import { useId, useMemo, useState, type ReactElement } from 'react';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

/**
 * Creating a tracked link.
 *
 * The destination is validated in the browser for the two failures the redirect
 * service rejects anyway, so the user hears about them while typing rather than
 * after a round trip: a scheme other than https, and a private network host.
 * The browser check is a courtesy. The server check is the one that counts, and
 * its refusal renders in the same place.
 */

export interface LinkDraft {
  readonly destination: string;
  readonly campaign: string | null;
  readonly slug: string | null;
  readonly domainId: string | null;
  readonly utm: Readonly<Record<string, string>>;
  readonly expiresAt: string | null;
}

export interface LinkCreateDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submitting: boolean;
  readonly error: unknown;
  readonly onSubmit: (draft: LinkDraft) => void;
}

const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[::1\]$|.*\.local$)/i;

type DestinationProblem = 'scheme' | 'private' | null;

function inspectDestination(value: string): DestinationProblem {
  if (value.trim().length === 0) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'scheme';
  }
  if (url.protocol !== 'https:') {
    return 'scheme';
  }
  if (PRIVATE_HOST.test(url.hostname)) {
    return 'private';
  }
  return null;
}

export function LinkCreateDialog({
  open,
  onOpenChange,
  submitting,
  error,
  onSubmit,
}: LinkCreateDialogProps): ReactElement {
  const t = useTranslations();
  const formId = useId();
  const [destination, setDestination] = useState('');
  const [slug, setSlug] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');

  const problem = useMemo(() => inspectDestination(destination), [destination]);
  const canSubmit = destination.trim().length > 0 && problem === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" closeLabel={t('a11y.label.closeDialog')}>
        <DialogHeader>
          <DialogTitle>{t('analytics.links.new')}</DialogTitle>
          <DialogDescription>{t('analytics.links.measurementExplained')}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id={formId}
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) {
                return;
              }
              const utm: Record<string, string> = {};
              if (utmSource.trim()) utm.source = utmSource.trim();
              if (utmMedium.trim()) utm.medium = utmMedium.trim();
              onSubmit({
                destination: destination.trim(),
                campaign: null,
                slug: slug.trim() === '' ? null : slug.trim(),
                domainId: null,
                utm,
                expiresAt: null,
              });
            }}
          >
            <Field
              label={t('analytics.links.createDestination')}
              description={t('analytics.links.createDestinationHelp')}
              required
              error={
                problem === 'scheme'
                  ? t('analytics.links.blockedScheme')
                  : problem === 'private'
                    ? t('analytics.links.blockedPrivate')
                    : undefined
              }
            >
              {(control) => (
                <Input
                  {...control}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                />
              )}
            </Field>

            <Field
              label={t('analytics.links.createSlug')}
              description={t('analytics.links.createSlugHelp')}
            >
              {(control) => (
                <Input
                  {...control}
                  autoComplete="off"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              )}
            </Field>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-label text-text-tertiary">
                {t('analytics.links.createUtm')}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="utm_source">
                  {(control) => (
                    <Input
                      {...control}
                      autoComplete="off"
                      value={utmSource}
                      onChange={(event) => setUtmSource(event.target.value)}
                    />
                  )}
                </Field>
                <Field label="utm_medium">
                  {(control) => (
                    <Input
                      {...control}
                      autoComplete="off"
                      value={utmMedium}
                      onChange={(event) => setUtmMedium(event.target.value)}
                    />
                  )}
                </Field>
              </div>
            </fieldset>

            {error ? (
              <Notice
                tone="destructive"
                liveness="alert"
                title={t('analytics.links.errorTitle')}
                description={t('analytics.links.errorBody')}
              />
            ) : null}
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            loading={submitting}
            disabled={!canSubmit}
          >
            {t('action.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
