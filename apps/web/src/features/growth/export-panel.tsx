'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Button, Code, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import {
  GROWTH_PLAN_SCHEMA_VERSION,
  type GrowthExportFormat,
  type GrowthPlan,
} from '@relay/contracts';

import { SettingsPanel } from '../settings/components/section.js';
import { useFormatters } from '../settings/lib/formatters.js';
import { toJson, toMarkdown, toYaml, type MarkdownLabels } from './lib/plan-export.js';

export interface ExportPanelProps {
  plan: GrowthPlan;
}

const FORMATS: readonly GrowthExportFormat[] = ['markdown', 'json', 'yaml'];

const FORMAT_LABEL_KEYS: Readonly<Record<GrowthExportFormat, string>> = {
  markdown: 'growth.export.markdown',
  json: 'growth.export.json',
  yaml: 'growth.export.yaml',
};

const FILE_EXTENSIONS: Readonly<Record<GrowthExportFormat, string>> = {
  markdown: 'md',
  json: 'json',
  yaml: 'yaml',
};

/**
 * One plan, three views.
 *
 * The preview is generated locally from the same validated plan object the
 * server exports, so the user can read exactly what they are about to copy
 * before anything leaves the page.
 */
export function ExportPanel({ plan }: ExportPanelProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const { announce } = useAnnouncer();
  const [format, setFormat] = useState<GrowthExportFormat>('markdown');
  const [copyFailed, setCopyFailed] = useState(false);

  const labels = useMemo<MarkdownLabels>(
    () => ({
      section: { business_snapshot: t('growth.ui.strategy.snapshotTitle') },
      title: t('growth.title'),
      version: t('growth.plan.version', {
        version: plan.revision,
        date: formatters.date(plan.generatedAt),
      }),
      facts: t('growth.ui.confirm.factsTitle'),
      assumptions: t('growth.ui.confirm.assumptionsTitle'),
      missing: t('growth.ui.confirm.missingTitle'),
      objective: t('growth.strategy.objective'),
      channels: t('growth.strategy.channels'),
      pillars: t('growth.strategy.pillars'),
      cadence: t('growth.strategy.cadence'),
      ctaLibrary: t('growth.strategy.ctaLibrary'),
      ugc: t('growth.ugc.title'),
      opportunities: t('growth.opportunities.title'),
      tools: t('growth.tools.title'),
      fourWeek: t('growth.fourWeek.title'),
      risks: t('growth.strategy.risks'),
      mediaBoundary: t('billing.mediaGeneration.title'),
    }),
    [formatters, plan.generatedAt, plan.revision, t],
  );

  const body = useMemo(() => {
    if (format === 'json') {
      return toJson(plan);
    }
    if (format === 'yaml') {
      return toYaml(plan);
    }
    return toMarkdown(plan, labels);
  }, [format, labels, plan]);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(body);
      setCopyFailed(false);
      announce(t('growth.ui.export.copied'));
    } catch {
      setCopyFailed(true);
    }
  }

  function download(): void {
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `growth-plan-v${plan.revision}.${FILE_EXTENSIONS[format]}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SettingsPanel
      title={t('growth.ui.export.title')}
      description={t('growth.export.help')}
      footnote={t('growth.ui.export.schemaNote', { version: GROWTH_PLAN_SCHEMA_VERSION })}
    >
      <fieldset className="flex flex-col gap-1 border-0 p-0">
        <legend className="text-body-md text-text-primary pb-1 font-medium">
          {t('growth.ui.export.formatLabel')}
        </legend>
        <RadioGroup
          value={format}
          onValueChange={(value) => setFormat(value as GrowthExportFormat)}
          className="flex flex-wrap gap-x-4"
        >
          {FORMATS.map((entry) => (
            <label
              key={entry}
              className="text-body-md text-text-primary flex min-h-11 items-center gap-2"
            >
              <RadioGroupItem value={entry} />
              {t(FORMAT_LABEL_KEYS[entry])}
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => void copy()}>
          {t('growth.ui.export.copy')}
        </Button>
        <Button variant="secondary" onClick={download}>
          {t('growth.ui.export.download')}
        </Button>
      </div>

      {copyFailed ? (
        <p className="text-body-sm text-warning-fg">{t('settings.ui.copyFailed')}</p>
      ) : null}

      <div className="flex flex-col gap-1">
        <h3 className="text-label text-text-tertiary">{t('growth.ui.export.previewLabel')}</h3>
        <Code block className="max-h-96 overflow-auto">
          {body}
        </Code>
      </div>
    </SettingsPanel>
  );
}
