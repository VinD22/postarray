'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useToast } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { describeApiError } from './api-error.js';

export interface SettingsMutationOptions<TInput, TResult> {
  /** The section name, already translated. Used in the announcements. */
  section: string;
  mutationFn: (input: TInput) => Promise<TResult>;
  /** Query keys to refetch after a write. */
  invalidate?: readonly QueryKey[];
  onSuccess?: (result: TResult, input: TInput) => void;
  /** Replaces the default "saved" toast, for example after a rotation. */
  successMessage?: string;
}

export interface SettingsMutation<TInput, TResult> {
  run: (input: TInput) => Promise<TResult | undefined>;
  isSaving: boolean;
  error: unknown;
  reset: () => void;
}

/**
 * A settings write.
 *
 * There is no optimistic update here on purpose. These mutations change
 * permissions, credentials, billing and webhook delivery, so showing a state
 * that has not been accepted by the server would be a lie with consequences.
 * Every result is announced: politely when it saved, assertively when it did
 * not, together with the fact that the input is still on screen.
 */
export function useSettingsMutation<TInput, TResult>(
  options: SettingsMutationOptions<TInput, TResult>,
): SettingsMutation<TInput, TResult> {
  const { section, mutationFn, invalidate, onSuccess, successMessage } = options;
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { announce } = useAnnouncer();
  const { toast } = useToast();

  const mutation = useMutation<TResult, unknown, TInput>({
    mutationFn,
    onSuccess: async (result, input) => {
      announce(t('settings.ui.state.savedAnnouncement', { section }));
      toast({ title: successMessage ?? t('settings.saved'), tone: 'success' });
      for (const key of invalidate ?? []) {
        await queryClient.invalidateQueries({ queryKey: key });
      }
      onSuccess?.(result, input);
    },
    onError: (error) => {
      const described = describeApiError(error);
      announce(t('settings.ui.state.saveFailedAnnouncement', { section }), 'assertive');
      toast({
        title: t('settings.ui.state.saveFailedAnnouncement', { section }),
        description:
          described.messageKey === null
            ? t('error.unknown.action')
            : t(described.messageKey, described.values),
        tone: 'destructive',
      });
    },
  });

  const run = useCallback(
    async (input: TInput) => {
      announce(t('settings.ui.state.savingAnnouncement', { section }));
      try {
        return await mutation.mutateAsync(input);
      } catch {
        // Already reported through the announcer and the toast. The caller
        // keeps its form state so nothing the user typed is lost.
        return undefined;
      }
    },
    [announce, mutation, section, t],
  );

  return {
    run,
    isSaving: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
