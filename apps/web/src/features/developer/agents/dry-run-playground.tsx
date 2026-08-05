'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Code,
  Field,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { agentsGateway } from '../../settings/lib/gateway.js';
import { useSettingsMutation } from '../../settings/lib/use-settings-mutation.js';
import type { ServiceAccountView } from '../../settings/lib/view-models.js';

/** The tools an agent can exercise against seeded data. */
const DRY_RUN_TOOLS: readonly { readonly id: string; readonly sample: string }[] = [
  { id: 'list_connections', sample: '{}' },
  { id: 'get_capabilities', sample: '{\n  "connectionId": "conn_seed_x_acme"\n}' },
  {
    id: 'create_draft',
    sample:
      '{\n  "brandId": "brand_seed_acme_eu",\n  "body": "We shipped scheduled first comments.",\n  "targets": ["conn_seed_x_acme"]\n}',
  },
  { id: 'validate_content', sample: '{\n  "contentItemId": "post_seed_launch"\n}' },
  {
    id: 'schedule_post',
    sample:
      '{\n  "contentItemId": "post_seed_launch",\n  "publishAt": "2026-08-11T07:30:00.000Z",\n  "timeZone": "Europe/Berlin"\n}',
  },
  { id: 'publish_now', sample: '{\n  "contentItemId": "post_seed_launch"\n}' },
  { id: 'get_analytics', sample: '{\n  "connectionId": "conn_seed_x_acme", "window": "30d"\n}' },
];

export interface DryRunPlaygroundProps {
  account: ServiceAccountView;
}

/**
 * A dry run against seeded data.
 *
 * The point is not to see a successful response, it is to see a refusal before
 * an agent hits it in production. The playground applies the same scope and
 * approval level checks the API applies, so a call the account may not make
 * comes back denied here with the same sentence.
 */
export function DryRunPlayground({ account }: DryRunPlaygroundProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();

  const [tool, setTool] = useState(DRY_RUN_TOOLS[0]?.id ?? 'list_connections');
  const [args, setArgs] = useState(DRY_RUN_TOOLS[0]?.sample ?? '{}');
  const [jsonError, setJsonError] = useState(false);
  const [result, setResult] = useState<{
    outcome: 'ok' | 'denied';
    body: unknown;
    reason: string | null;
  } | null>(null);

  const run = useSettingsMutation({
    section: t('developer.playground.title'),
    mutationFn: agentsGateway.dryRun,
    successMessage: t('developer.playground.sandboxBadge'),
    onSuccess: (response) => {
      setResult(response);
      announce(
        t('developer.ui.playground.announceResult', {
          outcome:
            response.outcome === 'ok'
              ? t('developer.ui.activity.outcome.ok')
              : t('developer.ui.activity.outcome.denied'),
        }),
      );
    },
  });

  function selectTool(nextTool: string): void {
    setTool(nextTool);
    const sample = DRY_RUN_TOOLS.find((entry) => entry.id === nextTool)?.sample;
    if (sample !== undefined) {
      setArgs(sample);
      setJsonError(false);
    }
  }

  function submit(): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(args);
    } catch {
      setJsonError(true);
      return;
    }
    setJsonError(false);
    void run.run({ serviceAccountId: account.id, tool, args: parsed });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">{t('developer.playground.sandboxBadge')}</Badge>
        <p className="text-body-md text-text-secondary">
          {t('developer.ui.playground.help')}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Field label={t('developer.ui.playground.tool')}>
            {(control) => (
              <Select value={tool} onValueChange={selectTool}>
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DRY_RUN_TOOLS.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field
            label={t('developer.ui.playground.arguments')}
            description={t('developer.ui.playground.argumentsHelp')}
            error={jsonError ? t('developer.ui.playground.invalidJson') : undefined}
          >
            {(control) => (
              <Textarea
                {...control}
                className="font-mono"
                minRows={8}
                value={args}
                spellCheck={false}
                onChange={(event) => setArgs(event.target.value)}
              />
            )}
          </Field>

          <div>
            <Button variant="primary" loading={run.isSaving} onClick={submit}>
              {t('developer.playground.run')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-body-md font-medium text-text-primary">
            {t('developer.ui.playground.result')}
          </h3>

          {result === null ? (
            <p className="text-body-md text-text-secondary">
              {t('developer.ui.playground.resultEmpty')}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {result.outcome === 'denied' ? (
                <Notice
                  tone="warning"
                  title={t('developer.ui.activity.outcome.denied')}
                  description={
                    result.reason ??
                    t('developer.ui.playground.deniedByApproval', {
                      level: account.approvalLevel,
                    })
                  }
                />
              ) : null}
              <Code block className="max-h-96 overflow-auto">
                {JSON.stringify(result.body, null, 2)}
              </Code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
