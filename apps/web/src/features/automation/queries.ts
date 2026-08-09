'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, newIdempotencyKey } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';

import {
  parseSampleEvent,
  toRuleDraft,
  toRuleInput,
  toRulePreflight,
  toRuleRun,
} from './rule-api-adapters';
import type { RuleDraft } from './types';
import type { RulePreflight, RuleRunPreview, RuleRunView, RuleSummaryView } from './types';

/**
 * Reads and writes for automation rules and RSS feeds.
 *
 * No mutation here is optimistic. Every one of them changes whether something
 * can act on a connected account without a person present, and the whole point
 * of the preflight is that the user is told the truth about the current state.
 * A rule that looks active in the browser but is not, or the reverse, is worse
 * than a spinner.
 */

const THIRTY_SECONDS = 30 * 1000;

export const automationKeys = {
  all: ['automation'] as const,
  rules: ['automation', 'rules'] as const,
  rule: (ruleId: string) => ['automation', 'rule', ruleId] as const,
  runs: (ruleId: string) => ['automation', 'runs', ruleId] as const,
  preview: (ruleId: string) => ['automation', 'preview', ruleId] as const,
  feeds: ['automation', 'feeds'] as const,
  feed: (feedId: string) => ['automation', 'feed', feedId] as const,
  feedHealth: (feedId: string) => ['automation', 'feedHealth', feedId] as const,
};

function requireValue<T>(value: T | null, code: string): T {
  if (value === null) throw new Error(code);
  return value;
}

export function useAutomationRules() {
  const { project } = useSession();
  return useQuery({
    queryKey: [...automationKeys.rules, project?.id ?? 'none'],
    enabled: project !== null,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly RuleSummaryView[]> => {
      const result = await api.automationRules.list({});
      return result.data
        .filter((rule) => rule.brandId === project?.id)
        .map((rule): RuleSummaryView => {
          const draft = toRuleDraft(rule);
          return {
            id: rule.id,
            name: rule.name,
            state: draft.state,
            draft,
            connectionCount: rule.preauthorizedConnectionIds.length,
            lastRunAt: rule.lastRunAt,
          };
        });
    },
  });
}

export function useAutomationRule(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.rule(ruleId),
    enabled,
    queryFn: async (): Promise<RuleDraft> =>
      toRuleDraft(requireValue(await api.automationRules.get(ruleId), 'RULE_NOT_AVAILABLE')),
  });
}

export function useRuleRuns(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.runs(ruleId),
    enabled,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly RuleRunView[]> => {
      const result = await api.automationRules.listRuns(ruleId, { limit: 20 });
      return result.data.map(toRuleRun);
    },
  });
}

export function useRulePreflight(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.preview(ruleId),
    enabled,
    queryFn: async (): Promise<RulePreflight> =>
      toRulePreflight(
        requireValue(await api.automationRules.previewSaved(ruleId), 'RULE_PREVIEW_NOT_AVAILABLE'),
      ),
  });
}

export function useSaveRule() {
  const client = useQueryClient();
  const { project } = useSession();
  return useMutation({
    mutationFn: async (draft: RuleDraft): Promise<RuleDraft> => {
      const brandId = project?.id;
      if (brandId === undefined) throw new Error('ACTIVE_PROJECT_REQUIRED');
      const saved =
        draft.id === null
          ? await api.automationRules.create(toRuleInput(draft, brandId), newIdempotencyKey('rule'))
          : await api.automationRules.update(draft.id, toRuleInput(draft, brandId));
      return toRuleDraft(requireValue(saved, 'RULE_SAVE_NOT_AVAILABLE'));
    },
    onSuccess: (saved) => {
      void client.invalidateQueries({ queryKey: automationKeys.rules });
      if (saved.id) {
        void client.invalidateQueries({ queryKey: automationKeys.rule(saved.id) });
        void client.invalidateQueries({ queryKey: automationKeys.preview(saved.id) });
      }
    },
  });
}

export function useSetRuleEnabled() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      readonly ruleId: string;
      readonly enabled: boolean;
    }): Promise<void> => {
      if (input.enabled) {
        await api.automationRules.enable(input.ruleId, newIdempotencyKey('rule_enable'));
        return;
      }
      await api.automationRules.disable(input.ruleId, newIdempotencyKey('rule_disable'));
    },
    onSuccess: (_result, input) => {
      void client.invalidateQueries({ queryKey: automationKeys.rule(input.ruleId) });
      void client.invalidateQueries({ queryKey: automationKeys.rules });
    },
  });
}

export function useTestRule() {
  return useMutation({
    mutationFn: async (input: {
      readonly ruleId: string;
      readonly payload?: string;
    }): Promise<RuleRunPreview> => {
      const sampleEvent = parseSampleEvent(input.payload);
      const run = requireValue(
        await api.automationRules.testRun(
          input.ruleId,
          { sampleEvent },
          newIdempotencyKey('rule_test'),
        ),
        'RULE_TEST_NOT_AVAILABLE',
      );
      const adapted = toRuleRun(run);
      return { ...adapted, triggeredAt: adapted.startedAt };
    },
  });
}

export function useDeleteRule() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (ruleId: string): Promise<void> => {
      await api.automationRules.delete(ruleId);
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: automationKeys.rules });
    },
  });
}
