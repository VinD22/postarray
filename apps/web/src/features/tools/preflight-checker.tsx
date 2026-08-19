'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Button, Checkbox, Field, Input, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n/format';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';
import type { PublishingLimitProvider } from '@/features/marketing/data/publishing-limits-types';

import {
  PREFLIGHT_PROVIDERS,
  runPreflight,
  type PreflightFinding,
  type PreflightMediaKind,
  type PreflightRow,
  type PreflightStatus,
} from './preflight';
import { parsePreflightPlatforms } from './preflight-link';
import { SourceNote, StatusTag } from './result-parts';

/**
 * The post preflight checker.
 *
 * Everything is state in this component. There is no fetch, no action and no
 * storage, which is the promise the page makes above it, so nothing here may
 * introduce one. The evaluation itself lives in `preflight.ts` so the rules can
 * be read and tested without rendering.
 */

const MEDIA_KINDS: readonly PreflightMediaKind[] = ['none', 'image', 'video'];

const DEFAULT_PROVIDERS: readonly PublishingLimitProvider[] = ['x', 'instagram', 'linkedin'];

function toNumber(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

const MEGABYTE = 1_000_000;

export function PreflightChecker(): ReactElement {
  const t = useTranslations();
  const [draft, setDraft] = useState('');
  const [selected, setSelected] = useState<readonly PublishingLimitProvider[]>(DEFAULT_PROVIDERS);
  const [mediaKind, setMediaKind] = useState<PreflightMediaKind>('none');
  const [imageCount, setImageCount] = useState('1');
  const [megabytes, setMegabytes] = useState('');
  const [duration, setDuration] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  /**
   * Honour `?platform=` once, after mount.
   *
   * This page is statically rendered, so the server never sees a query string
   * and reading one during render would make the first client paint disagree
   * with the delivered HTML. Applying it in an effect keeps the prerendered
   * form intact and still lets a specs page hand the reader a checker with the
   * platform it was about already ticked. A query naming nothing recognizable
   * leaves the defaults alone rather than clearing the selection.
   */
  useEffect(() => {
    const requested = parsePreflightPlatforms(window.location.search);
    if (requested.length > 0) {
      setSelected(requested);
    }
  }, []);

  const report = useMemo(() => {
    const sizeMb = toNumber(megabytes);
    return runPreflight({
      draft,
      providers: selected,
      mediaKind,
      imageCount: toNumber(imageCount) ?? 0,
      byteSize: sizeMb === null ? null : Math.round(sizeMb * MEGABYTE),
      durationSeconds: toNumber(duration),
      width: toNumber(width),
      height: toNumber(height),
    });
  }, [draft, selected, mediaKind, imageCount, megabytes, duration, width, height]);

  function toggle(provider: PublishingLimitProvider, checked: boolean): void {
    setSelected((current) =>
      checked ? [...current, provider] : current.filter((entry) => entry !== provider),
    );
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Field
          label={t.full('web.tools.preflight.field.draft.label')}
          description={t.full('web.tools.preflight.field.draft.help')}
        >
          {(control) => (
            <Textarea
              id={control.id}
              aria-describedby={control['aria-describedby']}
              rows={8}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          )}
        </Field>

        <fieldset className="border-border-default border-t pt-4">
          <legend className="text-title-sm text-text-primary">
            {t.full('web.tools.preflight.field.platforms.label')}
          </legend>
          <p className="text-body-sm text-text-tertiary mt-1">
            {t.full('web.tools.preflight.field.platforms.help')}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PREFLIGHT_PROVIDERS.map((provider) => (
              <li key={provider} className="flex items-center gap-2">
                <Checkbox
                  id={`preflight-platform-${provider}`}
                  checked={selected.includes(provider)}
                  onCheckedChange={(checked) => toggle(provider, checked === true)}
                />
                <label
                  htmlFor={`preflight-platform-${provider}`}
                  className="text-body-sm text-text-secondary"
                >
                  {t(`web.provider.${provider}`)}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="border-border-default border-t pt-4">
          <legend className="text-title-sm text-text-primary">
            {t.full('web.tools.preflight.field.mediaKind.label')}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {MEDIA_KINDS.map((kind) => (
              <Button
                key={kind}
                type="button"
                variant={mediaKind === kind ? 'primary' : 'secondary'}
                size="sm"
                aria-pressed={mediaKind === kind}
                onClick={() => setMediaKind(kind)}
              >
                {t(`web.tools.preflight.field.mediaKind.${kind}`)}
              </Button>
            ))}
          </div>
        </fieldset>

        {mediaKind === 'none' ? null : (
          <div className="grid gap-4 sm:grid-cols-2">
            {mediaKind === 'image' ? (
              <Field label={t.full('web.tools.preflight.field.mediaCount.label')}>
                {(control) => (
                  <Input
                    id={control.id}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={imageCount}
                    onChange={(event) => setImageCount(event.target.value)}
                  />
                )}
              </Field>
            ) : (
              <Field
                label={t.full('web.tools.preflight.field.duration.label')}
                description={t.full('web.tools.preflight.field.duration.help')}
              >
                {(control) => (
                  <Input
                    id={control.id}
                    aria-describedby={control['aria-describedby']}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                  />
                )}
              </Field>
            )}
            <Field
              label={t.full('web.tools.preflight.field.byteSize.label')}
              description={t.full('web.tools.preflight.field.byteSize.help')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  aria-describedby={control['aria-describedby']}
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={megabytes}
                  onChange={(event) => setMegabytes(event.target.value)}
                />
              )}
            </Field>
            <Field label={t.full('web.tools.preflight.field.width.label')}>
              {(control) => (
                <Input
                  id={control.id}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={width}
                  onChange={(event) => setWidth(event.target.value)}
                />
              )}
            </Field>
            <Field
              label={t.full('web.tools.preflight.field.height.label')}
              description={t.full('web.tools.preflight.field.dimensions.help')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  aria-describedby={control['aria-describedby']}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                />
              )}
            </Field>
          </div>
        )}
      </div>

      <section aria-labelledby="preflight-results-heading" className="flex flex-col gap-4">
        <h2 id="preflight-results-heading" className="text-title-sm text-text-primary">
          {t.full('web.tools.preflight.results.title')}
        </h2>
        <p aria-live="polite" className="text-body-sm text-text-secondary">
          {report.rows.length === 0
            ? t.full('web.tools.preflight.results.empty')
            : t.full('web.tools.preflight.results.summary', {
                fail: report.failCount,
                warning: report.warningCount,
              })}
        </p>
        <ul className="border-border-default border-t">
          {report.rows.map((row) => (
            <ResultRow key={row.provider} row={row} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function ResultRow({ row }: { readonly row: PreflightRow }): ReactElement {
  const t = useTranslations();
  const limits = PUBLISHING_LIMITS[row.provider];
  return (
    <li className="border-border-subtle flex flex-col gap-2 border-b py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-body-lg text-text-primary">{t(`web.provider.${row.provider}`)}</h3>
        <StatusTag status={row.status} label={statusLabel(t, row.status)} />
      </div>

      {row.count === null || limits.text === null || limits.countingUnit === null ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('web.tools.shared.unavailableWhy')}
        </p>
      ) : (
        <p className="text-body-sm text-text-secondary tabular-nums">
          {t.full('web.tools.preflight.count.label', {
            count: row.count,
            limit: limits.text.maxLength,
            unit: limits.countingUnit,
          })}
        </p>
      )}

      {row.findings.length === 0 ? null : (
        <ul className="flex flex-col gap-1">
          {row.findings.map((finding) => (
            <li key={finding.code} className="text-body-sm text-text-tertiary">
              {findingText(t, finding)}
            </li>
          ))}
        </ul>
      )}

      <SourceNote source={limits.source} />
    </li>
  );
}

type Translate = ReturnType<typeof useTranslations>;

function statusLabel(t: Translate, status: PreflightStatus): string {
  return t(`web.tools.preflight.status.${status}`);
}

/**
 * Byte and duration limits are rendered through `Intl` before they reach the
 * message, so the sentence stays one ICU string rather than a concatenation.
 */
function findingText(t: Translate, finding: PreflightFinding): string {
  if (finding.code === 'bytesOver') {
    const limit = finding.values['limit'];
    return t('web.tools.preflight.finding.bytesOver', {
      limit: formatBytes(t.locale, typeof limit === 'number' ? limit : 0),
    });
  }
  return t(`web.tools.preflight.finding.${finding.code}`, finding.values);
}
