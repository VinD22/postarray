'use client';

import { useId, useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import { Button, Checkbox, Field, Input, Textarea } from '@relay/design-system/primitives';
import { EmptyState, Notice, PageHeader } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import type { BulkImportRowState } from '@relay/contracts';

import { useSession } from '@/lib/auth/session-context';

import { ColumnReport } from './components/column-report';
import { RowTable } from './components/row-table';
import { useApplyImport, useImportRows, useUploadManifest } from './queries';
import { canApply, countLabel, problemsCsv, stepFor, stepIndex, templateCsv } from './wizard';

/**
 * The import wizard.
 *
 * Five steps in the order the decision is actually made: choose a file, see
 * whether the columns are right, read what each line will do, choose what
 * applying means, then see what happened. The apply choice defaults to drafts
 * and the scheduling choice is a second button with its own sentence, because
 * the difference between those two is the difference between a spreadsheet
 * mistake and a spreadsheet mistake with a date on it.
 *
 * Everything is reachable from the keyboard. The file input is a real file
 * input, there is a paste box for people who would rather paste, and nothing
 * here requires a pointer.
 */
function download(filename: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ImportScreen(): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { project } = useSession();
  const upload = useUploadManifest();
  const apply = useApplyImport();

  const pasteId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [allowPast, setAllowPast] = useState(false);
  const [filter, setFilter] = useState<BulkImportRowState | 'all'>('all');

  const report = upload.data ?? apply.data ?? null;
  const jobId = report?.job.id ?? null;
  const rows = useImportRows(jobId, filter);
  const step = stepFor(report);

  async function onFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (file === undefined) return;
    setFilename(file.name);
    setContent(await file.text());
    announce(t.full('import.a11y.uploadedFile', { filename: file.name }));
  }

  const counts = report?.job.counts ?? null;
  const unavailable = t.full('import.results.unavailable');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.full('import.title')} description={t.full('import.subtitle')} />

      <p className="text-body-sm text-text-tertiary">
        {t.full('import.step.position', { current: stepIndex(step), total: 5 })}
      </p>

      <section aria-labelledby="import-upload-heading" className="flex flex-col gap-4">
        <h2 id="import-upload-heading" className="text-title-md text-text-primary">
          {t.full('import.upload.heading')}
        </h2>
        <p className="text-body-sm text-text-secondary">{t.full('import.upload.help')}</p>

        <Field
          label={t.full('import.upload.field')}
          description={t.full('import.upload.fieldHelp')}
        >
          {(control) => (
            <Input
              id={control.id}
              ref={fileInput}
              type="file"
              accept="text/csv,.csv"
              onChange={(event) => {
                void onFile(event);
              }}
            />
          )}
        </Field>

        <Field
          label={t.full('import.upload.paste')}
          description={t.full('import.upload.pasteHelp')}
        >
          {(control) => (
            <Textarea
              id={control.id ?? pasteId}
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          )}
        </Field>

        <Field
          label={t.full('import.upload.allowPast')}
          description={t.full('import.upload.allowPastHelp')}
        >
          {(control) => (
            <Checkbox
              id={control.id}
              checked={allowPast}
              onCheckedChange={(next) => setAllowPast(next === true)}
            />
          )}
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              upload.mutate({
                filename: filename === '' ? 'manifest.csv' : filename,
                content,
                options: { allowPastSchedules: allowPast },
              });
            }}
            disabled={content.trim() === '' || project === null || upload.isPending}
          >
            {upload.isPending ? t.full('import.upload.submitting') : t.full('import.upload.submit')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              download('relay-import-template.csv', templateCsv());
            }}
          >
            {t.full('import.template.download')}
          </Button>
        </div>
      </section>

      {report === null ? null : (
        <>
          <ColumnReport columns={report.columns} issues={report.manifestIssues} />

          <section aria-labelledby="import-review-heading" className="flex flex-col gap-3">
            <h2 id="import-review-heading" className="text-title-md text-text-primary">
              {t.full('import.review.heading')}
            </h2>
            <p className="text-body-md text-text-secondary">
              {t.full('import.review.counts', {
                valid: counts?.valid ?? 0,
                invalid: counts?.invalid ?? 0,
              })}
            </p>
            <p className="text-body-sm text-text-tertiary">
              {t.full('import.review.parsedWith', { version: report.job.parserVersion })}
            </p>

            <div className="flex flex-wrap gap-2">
              {(['all', 'valid', 'invalid', 'failed'] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={filter === value ? 'primary' : 'secondary'}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value === 'all'
                    ? t.full('import.review.filterAll')
                    : value === 'valid'
                      ? t.full('import.review.filterValid')
                      : value === 'invalid'
                        ? t.full('import.review.filterInvalid')
                        : t.full('import.review.filterFailed')}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  download(
                    `import-problems-${report.job.id}.csv`,
                    problemsCsv(rows.data ?? [], report.manifestIssues),
                  );
                }}
              >
                {t.full('import.review.downloadErrors')}
              </Button>
            </div>

            {rows.data === undefined || rows.data.length === 0 ? (
              <EmptyState
                title={t.full('import.review.rowsHeading')}
                description={t.full('import.review.empty')}
              />
            ) : (
              <RowTable rows={rows.data} />
            )}
          </section>

          <section aria-labelledby="import-apply-heading" className="flex flex-col gap-3">
            <h2 id="import-apply-heading" className="text-title-md text-text-primary">
              {t.full('import.apply.heading')}
            </h2>
            <Notice
              tone="neutral"
              title={t.full('import.apply.drafts')}
              description={t.full('import.apply.draftsHelp')}
            />
            <Notice
              tone="warning"
              title={t.full('import.apply.scheduled')}
              description={t.full('import.apply.scheduledHelp')}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={!canApply(report) || apply.isPending}
                onClick={() => {
                  apply.mutate({ importJobId: report.job.id, mode: 'drafts' });
                }}
              >
                {t.full('import.apply.confirm', { count: counts?.valid ?? 0 })}
              </Button>
              <Button
                variant="secondary"
                disabled={!canApply(report) || apply.isPending}
                onClick={() => {
                  apply.mutate({ importJobId: report.job.id, mode: 'scheduled' });
                }}
              >
                {t.full('import.apply.confirmScheduled', { count: counts?.valid ?? 0 })}
              </Button>
            </div>
            <p className="text-body-sm text-text-tertiary">{t.full('import.apply.safeToRepeat')}</p>
          </section>

          {report.job.appliedAt === null ? null : (
            <section aria-labelledby="import-results-heading" className="flex flex-col gap-2">
              <h2 id="import-results-heading" className="text-title-md text-text-primary">
                {t.full('import.results.heading')}
              </h2>
              <ul className="text-body-md text-text-secondary flex flex-col gap-1">
                <li>{t.full('import.results.applied', { count: counts?.applied ?? 0 })}</li>
                <li>{t.full('import.results.skipped', { count: counts?.skipped ?? 0 })}</li>
                <li>{t.full('import.results.failed', { count: counts?.failed ?? 0 })}</li>
                <li>{countLabel(counts?.total ?? null, unavailable)}</li>
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
