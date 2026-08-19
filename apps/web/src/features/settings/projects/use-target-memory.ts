'use client';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { api, type ApiError } from '@/lib/api';
import { useWorkspaceId } from '@/lib/auth/session-context';

export interface SetTargetMemoryInput {
  readonly projectId: string;
  readonly enabled: boolean;
}

/**
 * The project opt in.
 *
 * Not optimistic. Turning this off deletes every saved selection in the
 * project, so the interface waits for the server to say it happened rather than
 * showing a switch that has moved and a deletion that has not.
 */
export function useSetTargetMemory(): UseMutationResult<
  { readonly projectId: string; readonly enabled: boolean },
  ApiError,
  SetTargetMemoryInput
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (input: SetTargetMemoryInput) =>
      api.targetMemory.setEnabled(input.projectId, input.enabled),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'projects'] });
      void queryClient.invalidateQueries({
        queryKey: ['ws', workspaceId, 'remembered-targets', input.projectId],
      });
    },
  });
}
