'use client';

/**
 * The panel that makes "apply to all" honest.
 *
 * It shows three groups before anything is written: the targets that take the
 * change, the targets that keep their own version, and the targets that cannot
 * take it, each with the reason and the exact text they would receive instead.
 */

import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context.js';
import { commitGlobalEdit, planGlobalEdit } from '../state/global-edit.js';
import { PROVIDER_LABEL } from './provider-identity.js';
import type { IncompatibilityCode } from '../state/capability-rules.js';

const REASON_KEY: Readonly<Record<IncompatibilityCode, string>> = {
  text_too_long: 'composerWeb.globalEdit.reason.textTooLong',
  link_not_allowed: 'composerWeb.globalEdit.reason.linkNotAllowed',
  media_count_exceeded: 'composerWeb.globalEdit.reason.mediaCountExceeded',
  media_kind_unsupported: 'composerWeb.globalEdit.reason.mediaKindUnsupported',
  thread_unsupported: 'composerWeb.globalEdit.reason.threadUnsupported',
  markdown_unsupported: 'composerWeb.globalEdit.reason.markdownUnsupported',
};

export interface GlobalEditDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function GlobalEditDialog({ open, onOpenChange }: GlobalEditDialogProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { bootstrap, state, runAll } = useComposer();
  const [body, setBody] = useState(state.master.body);

  const accountLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const account of bootstrap.accounts) {
      map.set(
        account.connectionId,
        `${account.displayName} (${PROVIDER_LABEL[account.provider]})`,
      );
    }
    return map;
  }, [bootstrap.accounts]);

  const input = useMemo(
    () => ({ state, accounts: bootstrap.accounts, field: 'body' as const, body }),
    [body, bootstrap.accounts, state],
  );
  const plan = useMemo(() => planGlobalEdit(input), [input]);

  const apply = (): void => {
    runAll(commitGlobalEdit(plan, input));
    announce(
      t.full('composerWeb.globalEdit.announced', {
        applied: plan.appliesTo.length,
        adapted: plan.incompatible.length,
      }),
      'polite',
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{t.full('composerWeb.globalEdit.title')}</DialogTitle>
          <DialogDescription>{t.full('composerWeb.globalEdit.description')}</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="global-edit-body" className="text-label text-text-secondary">
              {t.full('composer.master.label')}
            </label>
            <Textarea
              id="global-edit-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              autoGrow
              minRows={5}
              maxRows={16}
            />
          </div>

          {plan.noChange ? (
            <Notice tone="info" title={t.full('composerWeb.globalEdit.nothingToApply')} />
          ) : null}

          <TargetGroup
            heading={t.full('composerWeb.globalEdit.compatibleHeading')}
            ids={plan.appliesTo}
            labels={accountLabel}
          />

          <TargetGroup
            heading={t.full('composerWeb.globalEdit.keepsOverrideHeading')}
            ids={plan.keepsOverride}
            labels={accountLabel}
          />

          {plan.incompatible.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h3 className="text-title-sm text-text-primary">
                {t.full('composerWeb.globalEdit.incompatibleHeading')}
              </h3>
              <p className="text-body-sm text-text-secondary">
                {t.full('composerWeb.globalEdit.incompatibleHelp')}
              </p>
              <ul className="flex flex-col gap-3">
                {plan.incompatible.map((entry) => {
                  const label = accountLabel.get(entry.connectionId) ?? entry.connectionId;
                  return (
                    <li
                      key={entry.connectionId}
                      className="border-s-2 border-warning-border ps-3"
                    >
                      <p className="text-body-md text-text-primary">{label}</p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {entry.reasons.map((reason) => (
                          <li key={reason.code} className="text-body-sm text-text-secondary">
                            {t(REASON_KEY[reason.code], {
                              account: label,
                              ...reason.params,
                            })}
                          </li>
                        ))}
                      </ul>
                      {entry.adaptedBody !== null ? (
                        <div className="mt-2">
                          <p className="text-label text-text-tertiary">
                            {t.full('composerWeb.globalEdit.adaptedPreview', { account: label })}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap rounded-md bg-surface-sunken px-2.5 py-2 text-body-sm text-text-primary">
                            {entry.adaptedBody}
                          </p>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t.full('action.cancel')}
          </Button>
          <Button variant="primary" onClick={apply} disabled={plan.noChange}>
            {t.full('composerWeb.globalEdit.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TargetGroup({
  heading,
  ids,
  labels,
}: {
  readonly heading: string;
  readonly ids: readonly string[];
  readonly labels: ReadonlyMap<string, string>;
}): ReactNode {
  if (ids.length === 0) {
    return null;
  }
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-title-sm text-text-primary">{heading}</h3>
      <ul className="flex flex-col gap-1">
        {ids.map((id) => (
          <li key={id} className="text-body-sm text-text-secondary">
            {labels.get(id) ?? id}
          </li>
        ))}
      </ul>
    </section>
  );
}
