'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueueRuleView, QueueSlotReservationView, SlotProposal } from '@relay/contracts';

import { newIdempotencyKey } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';

import { queueApi } from './queue-api';
import { toInput, type RuleDraft } from './rule-draft';

/**
 * Reads and writes for the posting queue.
 *
 * No mutation here is optimistic. A reservation holds a real instant that other
 * people in the workspace can no longer take, and a rule change decides when
 * real posts go out. A queue that looks saved in the browser but is not is
 * worse than a spinner.
 */

const THIRTY_SECONDS = 30 * 1000;

export const queueKeys = {
  all: ['queue'] as const,
  rules: (projectId: string) => ['queue', 'rules', projectId] as const,
  rule: (ruleId: string) => ['queue', 'rule', ruleId] as const,
  nextSlot: (projectId: string) => ['queue', 'nextSlot', projectId] as const,
};

export function useQueueRules() {
  const { project } = useSession();
  const projectId = project?.id ?? null;
  return useQuery({
    queryKey: queueKeys.rules(projectId ?? 'none'),
    enabled: projectId !== null,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly QueueRuleView[]> => {
      if (projectId === null) return [];
      const page = await queueApi.listRules(projectId);
      return page.data;
    },
  });
}

/** Read-only. Shows what the queue would offer without holding anything. */
export function useNextQueueSlot(enabled: boolean) {
  const { project } = useSession();
  const projectId = project?.id ?? null;
  return useQuery({
    queryKey: queueKeys.nextSlot(projectId ?? 'none'),
    enabled: enabled && projectId !== null,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<SlotProposal> => {
      if (projectId === null) throw new Error('PROJECT_REQUIRED');
      return queueApi.previewSlot(projectId);
    },
  });
}

export function useSaveQueueRule() {
  const client = useQueryClient();
  const { project } = useSession();
  return useMutation({
    mutationFn: async (input: { draft: RuleDraft; ruleId?: string }): Promise<QueueRuleView> => {
      const projectId = project?.id;
      if (projectId === undefined) throw new Error('PROJECT_REQUIRED');
      const body = toInput(input.draft, projectId);
      if (input.ruleId === undefined) {
        return queueApi.createRule(body, newIdempotencyKey('queue'));
      }
      const { projectId: _projectId, ...patch } = body;
      return queueApi.updateRule(input.ruleId, patch, newIdempotencyKey('queue'));
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
}

export function useArchiveQueueRule() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string): Promise<QueueRuleView> => queueApi.archiveRule(ruleId),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
}

/** Holds the instant for a person to accept. It schedules nothing. */
export function useProposeQueueSlot() {
  const client = useQueryClient();
  const { project } = useSession();
  return useMutation({
    mutationFn: async (input: { contentItemId?: string }): Promise<QueueSlotReservationView> => {
      const projectId = project?.id;
      if (projectId === undefined) throw new Error('PROJECT_REQUIRED');
      return queueApi.proposeSlot(
        {
          projectId,
          ...(input.contentItemId === undefined ? {} : { contentItemId: input.contentItemId }),
        },
        newIdempotencyKey('queue'),
      );
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
}

export function useReleaseQueueSlot() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string): Promise<QueueSlotReservationView> =>
      queueApi.releaseSlot(reservationId),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
}
