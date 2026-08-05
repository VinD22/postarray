'use client';

/**
 * Inspect permissions.
 *
 * Three columns: the scope as the provider names it, whether it was granted,
 * and what Relay uses it for. The third column is the one that matters. A
 * scope list without purposes is a compliance artefact; with purposes it is
 * the answer to "why does this tool need that".
 *
 * Under the table, the same account's capability summary, generated from its
 * own snapshot rather than from the platform in general, because an account
 * type changes what a platform will accept.
 */

import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  CapabilityBadge,
  Code,
  Notice,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  VisuallyHidden,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import { useAccountTypeName, useProviderName } from './provider';
import { supportFor, badgeState } from './capability-matrix';
import { missingPermissionCount } from './health';
import { CAPABILITY_FEATURES, type CapabilitySnapshot, type ConnectionRow } from './types';

export interface PermissionsSheetProps {
  row: ConnectionRow | null;
  snapshot: CapabilitySnapshot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReconnect: (row: ConnectionRow) => void;
}

export function PermissionsSheet({
  row,
  snapshot,
  open,
  onOpenChange,
  onReconnect,
}: PermissionsSheetProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const accountTypeName = useAccountTypeName();

  if (!row) return null;

  const permissions = row.permissions ?? [];
  const missing = missingPermissionCount(row);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="inline-end"
        closeLabel={t('action.close')}
        className="w-[min(34rem,calc(100vw-3rem))]"
      >
        <SheetHeader>
          <SheetTitle>
            {t('web.connection.permissions.title', { account: row.displayName })}
          </SheetTitle>
          <p className="text-body-sm text-text-secondary">
            {t('receipt.target', {
              account: row.displayName,
              provider: providerName(row.provider),
            })}
          </p>
          <Badge tone="outline">{accountTypeName(row.accountType)}</Badge>
        </SheetHeader>

        <SheetBody>
          <div className="flex flex-col gap-5">
            {missing > 0 ? (
              <Notice
                tone="warning"
                title={t('web.connection.permissions.missingWarning', { count: missing })}
                description={t('connection.reconnect.body')}
              />
            ) : null}

            <TableContainer>
              <Table>
                <TableCaption>
                  <VisuallyHidden>
                    {t('web.connection.permissions.title', { account: row.displayName })}
                  </VisuallyHidden>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('web.connection.permissions.scopeColumn')}</TableHead>
                    <TableHead>{t('web.connection.permissions.stateColumn')}</TableHead>
                    <TableHead>{t('web.connection.permissions.purposeColumn')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.scope} attention={!permission.granted}>
                      <TableRowHeader>
                        <Code>{permission.scope}</Code>
                      </TableRowHeader>
                      <TableCell>
                        <Badge tone={permission.granted ? 'success' : 'warning'}>
                          {permission.granted
                            ? t('connection.permissions.granted')
                            : t('connection.permissions.missing')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {t(permission.purposeKey)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <section className="flex flex-col gap-2">
              <h3 className="text-title-sm text-text-primary">{t('capability.title')}</h3>
              {snapshot ? (
                <>
                  <p className="text-body-sm text-text-tertiary">
                    {t('web.connection.permissions.snapshot', {
                      provider: providerName(row.provider),
                      relativeTime: format.relative(snapshot.observedAt),
                    })}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {CAPABILITY_FEATURES.map((feature) => {
                      const support = supportFor(snapshot, feature);
                      return (
                        <li
                          key={feature}
                          className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle py-1.5 last:border-b-0"
                        >
                          <span className="text-body-md text-text-primary">
                            {t(`capability.feature.${feature}`)}
                          </span>
                          <CapabilityBadge
                            state={badgeState(support)}
                            label={t(`capability.level.${support}`)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="text-body-md text-text-secondary">
                  {t('web.connection.capability.noSnapshot')}
                </p>
              )}
            </section>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('action.close')}
          </Button>
          <Button variant="primary" onClick={() => onReconnect(row)}>
            {t('action.reconnect')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
