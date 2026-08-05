'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { RuleDraft } from './types';
import type {
  RulePreflight,
  RuleRunPreview,
  RuleRunView,
  RuleSummaryView,
  RuleVersionView,
} from './types';

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
  versions: (ruleId: string) => ['automation', 'versions', ruleId] as const,
  preview: (ruleId: string) => ['automation', 'preview', ruleId] as const,
  feeds: ['automation', 'feeds'] as const,
  feed: (feedId: string) => ['automation', 'feed', feedId] as const,
  feedHealth: (feedId: string) => ['automation', 'feedHealth', feedId] as const,
};

/** TODO(web): depends on `@/lib/api` publishing typed automation view models. */
function adapt<T>(value: unknown): T {
  return value as T;
}

export function useAutomationRules() {
  return useQuery({
    queryKey: automationKeys.rules,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly RuleSummaryView[]> => {
      const result = await api.automationRules.list({});
      return adapt<{ readonly data: readonly RuleSummaryView[] }>(result).data;
    },
  });
}

export function useAutomationRule(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.rule(ruleId),
    enabled,
    queryFn: async (): Promise<RuleDraft> =>
      adapt<RuleDraft>(await api.automationRules.get(ruleId)),
  });
}

export function useRuleRuns(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.runs(ruleId),
    enabled,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly RuleRunView[]> => {
      const result = await api.automationRules.listRuns({ ruleId, limit: 20 });
      return adapt<{ readonly data: readonly RuleRunView[] }>(result).data;
    },
  });
}

export function useRulePreflight(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.preview(ruleId),
    enabled,
    queryFn: async (): Promise<RulePreflight> =>
      adapt<RulePreflight>(await api.automationRules.preview({ ruleId })),
  });
}

/**
 * Version history.
 *
 * Not exposed by the shared client yet, and declared as an optional member
 * rather than faked from the rule itself, so an empty history is never
 * presented as "this rule has only ever had one version".
 *
 * TODO(web): depends on `@/lib/api` exposing `automationRules.listVersions`.
 */
type AutomationApi = typeof api.automationRules & {
  readonly listVersions?: (input: { readonly ruleId: string }) => Promise<unknown>;
};

export function useRuleVersions(ruleId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.versions(ruleId),
    enabled,
    queryFn: async (): Promise<readonly RuleVersionView[]> => {
      const listVersions = (api.automationRules as AutomationApi).listVersions;
      if (!listVersions) {
        throw new Error('automationRules.listVersions is not available in this client build');
      }
      const result = await listVersions({ ruleId });
      return adapt<{ readonly data: readonly RuleVersionView[] }>(result).data;
    },
  });
}

export function useSaveRule() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (draft: RuleDraft): Promise<RuleDraft> =>
      adapt<RuleDraft>(
        draft.id === null
          ? await api.automationRules.create(draft)
          : await api.automationRules.update(draft.id, draft),
      ),
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
        await api.automationRules.enable(input.ruleId);
        return;
      }
      await api.automationRules.disable(input.ruleId);
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
    }): Promise<RuleRunPreview> =>
      adapt<RuleRunPreview>(await api.automationRules.testRun(input)),
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
