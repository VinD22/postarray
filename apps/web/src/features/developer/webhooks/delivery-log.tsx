'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Code,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  StatusDot,
} from '@relay/design-system/primitives';
import { DefinitionList, EmptyState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../../settings/lib/formatters.js';
import type { WebhookDeliveryView } from '../../settings/lib/view-models.js';

const STATUS_TONE = {
  pending: 'neutral',
  succeeded: 'success',
  failed: 'warning',
  exhausted: 'destructive',
  disabled: 'neutral',
} as const;

export interface DeliveryLogProps {
  deliveries: readonly WebhookDeliveryView[];
  redelivering: boolean;
  onRedeliver: (deliveryId: string) => void;
}

/**
 * Delivery history with the response the receiver returned.
 *
 * A redelivery reuses the event id and sets the redelivery flag, so the row
 * says so rather than looking like a second event. Without that, a receiver
 * that deduplicates correctly appears to be dropping messages.
 */
export function DeliveryLog({
  deliveries,
  redelivering,
  onRedeliver,
}: DeliveryLogProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [inspecting, setInspecting] = useState<WebhookDeliveryView | null>(null);

  if (deliveries.length === 0) {
    return (
      <EmptyState
        compact
        title={t('developer.ui.activity.emptyTitle')}
        description={t('developer.ui.webhooks.testDeliveryHelp')}
        example={t('developer.ui.webhooks.emptyExample')}
      />
    );
  }

  return (
    <>
      {/* 768px and up: the full log. */}
      <div className="hidden md:block">
        <TableContainer className="max-h-[28rem]">
          <Table>
            <TableCaption className="sr-only">
              {t('developer.ui.webhooks.deliveriesCaption')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('developer.ui.webhooks.deliveryColumn.time')}</TableHead>
                <TableHead scope="col">{t('developer.ui.webhooks.deliveryColumn.event')}</TableHead>
                <TableHead scope="col" numeric>
                  {t('developer.ui.webhooks.deliveryColumn.attempt')}
                </TableHead>
                <TableHead scope="col" numeric>
                  {t('developer.ui.webhooks.deliveryColumn.response')}
                </TableHead>
                <TableHead scope="col">
                  {t('developer.ui.webhooks.deliveryColumn.status')}
                </TableHead>
                <TableHead scope="col">
                  <span className="sr-only">{t('common.details')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow
                  key={`${delivery.id}-${delivery.attempt}`}
                  attention={delivery.status === 'exhausted'}
                >
                  <TableRowHeader className="whitespace-nowrap tabular-nums">
                    {formatters.dateTime(delivery.requestedAt)}
                  </TableRowHeader>
                  <TableCell>
                    <span className="flex flex-wrap items-center gap-2">
                      <Code>{delivery.eventName}</Code>
                      {delivery.isTest ? (
                        <Badge tone="info">{t('developer.playground.sandboxBadge')}</Badge>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell numeric>{delivery.attempt}</TableCell>
                  <TableCell numeric>
                    {delivery.responseStatus ?? t('developer.ui.webhooks.deliveryNoResponse')}
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2">
                        <StatusDot tone={STATUS_TONE[delivery.status]} />
                        {t(`developer.ui.webhooks.deliveryStatus.${delivery.status}`)}
                      </span>
                      {delivery.nextAttemptAt === null ? null : (
                        <span className="text-body-sm text-text-tertiary">
                          {t('developer.ui.webhooks.deliveryNextAttempt', {
                            relativeTime: formatters.relative(delivery.nextAttemptAt),
                          })}
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-end">
                    <Button variant="ghost" size="sm" onClick={() => setInspecting(delivery)}>
                      {t('developer.ui.webhooks.inspect')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Below 768px: one row per delivery with the same facts. */}
      <ul className="flex flex-col md:hidden">
        {deliveries.map((delivery) => (
          <li
            key={`${delivery.id}-${delivery.attempt}`}
            className="border-border-subtle flex flex-col gap-2 border-b py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <Code>{delivery.eventName}</Code>
              <span className="text-body-sm flex items-center gap-2">
                <StatusDot tone={STATUS_TONE[delivery.status]} />
                {t(`developer.ui.webhooks.deliveryStatus.${delivery.status}`)}
              </span>
            </div>
            <DefinitionList
              layout="columns"
              items={[
                {
                  id: 'time',
                  term: t('developer.ui.webhooks.deliveryColumn.time'),
                  definition: formatters.dateTime(delivery.requestedAt),
                },
                {
                  id: 'attempt',
                  term: t('developer.ui.webhooks.deliveryColumn.attempt'),
                  definition: String(delivery.attempt),
                },
                {
                  id: 'response',
                  term: t('developer.ui.webhooks.deliveryColumn.response'),
                  definition:
                    delivery.responseStatus === null
                      ? t('developer.ui.webhooks.deliveryNoResponse')
                      : String(delivery.responseStatus),
                },
              ]}
            />
            <div>
              <Button variant="secondary" size="sm" onClick={() => setInspecting(delivery)}>
                {t('developer.ui.webhooks.inspect')}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={inspecting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setInspecting(null);
          }
        }}
      >
        <DialogContent closeLabel={t('a11y.label.closeDialog')} size="lg">
          <DialogHeader>
            <DialogTitle>
              {t('developer.ui.webhooks.inspectTitle', { id: inspecting?.id ?? '' })}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <section className="flex flex-col gap-1">
                <h3 className="text-body-md text-text-primary font-medium">
                  {t('developer.ui.webhooks.inspectRequest')}
                </h3>
                <Code block className="max-h-64 overflow-auto">
                  {inspecting?.requestBodyExcerpt ?? t('common.unavailable')}
                </Code>
              </section>
              <section className="flex flex-col gap-1">
                <h3 className="text-body-md text-text-primary font-medium">
                  {t('developer.ui.webhooks.inspectResponse')}
                </h3>
                <Code block className="max-h-64 overflow-auto">
                  {inspecting?.responseBodyExcerpt ?? t('developer.ui.webhooks.deliveryNoResponse')}
                </Code>
              </section>
              <p className="text-body-sm text-text-secondary">
                {t('developer.ui.webhooks.redeliverHelp')}
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInspecting(null)}>
              {t('action.close')}
            </Button>
            <Button
              variant="primary"
              loading={redelivering}
              onClick={() => {
                if (inspecting !== null) {
                  onRedeliver(inspecting.id);
                }
              }}
            >
              {t('developer.ui.webhooks.redeliver')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
