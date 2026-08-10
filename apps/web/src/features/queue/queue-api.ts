import type {
  Paginated,
  QueueRuleInput,
  QueueRulePatch,
  QueueRuleView,
  QueueSlotReservationView,
  SlotProposal,
} from '@relay/contracts';

import { call } from '@/lib/api/call';

/**
 * Queue rules over HTTP.
 *
 * The web app never calls `fetch` itself. Everything here goes through the same
 * transport as the rest of the product, so correlation, error typing and
 * idempotency are guaranteed by construction rather than by remembering.
 */

function unavailable(): never {
  throw new Error('The posting queue is unavailable in demo mode.');
}

export const queueApi = {
  listRules: (brandId: string): Promise<Paginated<QueueRuleView>> =>
    call('/queue/rules', { method: 'GET', query: { brandId } }, unavailable),

  getRule: (ruleId: string): Promise<QueueRuleView> =>
    call(`/queue/rules/${ruleId}`, { method: 'GET' }, unavailable),

  createRule: (input: QueueRuleInput, idempotencyKey: string): Promise<QueueRuleView> =>
    call('/queue/rules', { method: 'POST', body: input, idempotencyKey }, unavailable),

  updateRule: (
    ruleId: string,
    patch: QueueRulePatch,
    idempotencyKey: string,
  ): Promise<QueueRuleView> =>
    call(`/queue/rules/${ruleId}`, { method: 'PATCH', body: patch, idempotencyKey }, unavailable),

  archiveRule: (ruleId: string): Promise<QueueRuleView> =>
    call(`/queue/rules/${ruleId}`, { method: 'DELETE', sideEffectFree: true }, unavailable),

  /** Read-only. Shows the slot and its reasons without holding anything. */
  previewSlot: (brandId: string): Promise<SlotProposal> =>
    call('/queue/next-slot', { method: 'GET', query: { brandId } }, unavailable),

  proposeSlot: (
    input: { brandId: string; contentItemId?: string },
    idempotencyKey: string,
  ): Promise<QueueSlotReservationView> =>
    call('/queue/slots', { method: 'POST', body: input, idempotencyKey }, unavailable),

  acceptSlot: (
    reservationId: string,
    contentItemId: string,
    idempotencyKey: string,
  ): Promise<QueueSlotReservationView> =>
    call(
      `/queue/slots/${reservationId}/accept`,
      { method: 'POST', body: { contentItemId }, idempotencyKey },
      unavailable,
    ),

  releaseSlot: (reservationId: string, reason?: string): Promise<QueueSlotReservationView> =>
    call(
      `/queue/slots/${reservationId}/release`,
      { method: 'POST', body: reason === undefined ? {} : { reason }, sideEffectFree: true },
      unavailable,
    ),
};
