'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { RedirectMeasurement, TrackedLinkView } from './types';

/**
 * Reads and writes for tracked links.
 *
 * Two of these writes change what a published post points at, so neither is
 * optimistic. A destination edit is audited server side and a disable takes
 * effect on the public redirect immediately: showing the new state before the
 * server confirmed it would tell a user their emergency disable had worked when
 * it might not have.
 */

const ONE_MINUTE = 60 * 1000;

export const linkKeys = {
  all: ['links'] as const,
  list: (query: LinkListQuery) => ['links', 'list', query] as const,
  detail: (linkId: string) => ['links', 'detail', linkId] as const,
  stats: (linkId: string, range: { readonly start: string; readonly end: string }) =>
    ['links', 'stats', linkId, range] as const,
};

export interface LinkListQuery {
  readonly campaign?: string | undefined;
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
}

/** TODO(web): depends on `@/lib/api` publishing typed short link view models. */
function adapt<T>(value: unknown): T {
  return value as T;
}

export function useTrackedLinks(query: LinkListQuery = {}) {
  return useQuery({
    queryKey: linkKeys.list(query),
    staleTime: ONE_MINUTE,
    queryFn: async () => {
      const result = await api.shortLinks.list(query);
      return adapt<{
        readonly data: readonly TrackedLinkView[];
        readonly pageInfo: { readonly nextCursor: string | null; readonly hasMore: boolean };
      }>(result);
    },
  });
}

export function useLinkStats(
  linkId: string,
  range: { readonly start: string; readonly end: string },
  enabled = true,
) {
  return useQuery({
    queryKey: linkKeys.stats(linkId, range),
    enabled,
    staleTime: ONE_MINUTE,
    queryFn: async (): Promise<{
      readonly link: TrackedLinkView;
      readonly measurement: RedirectMeasurement;
    }> =>
      adapt(
        await api.shortLinks.getStats({
          shortLinkId: linkId,
          start: range.start,
          end: range.end,
        }),
      ),
  });
}

export interface CreateLinkInput {
  readonly destination: string;
  readonly campaign: string | null;
  readonly slug: string | null;
  readonly domainId: string | null;
  readonly utm: Readonly<Record<string, string>>;
  readonly expiresAt: string | null;
  readonly idempotencyKey: string;
}

export function useCreateLink() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLinkInput): Promise<TrackedLinkView> =>
      adapt<TrackedLinkView>(await api.shortLinks.create(input)),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: linkKeys.all });
    },
  });
}

/**
 * Editing a destination and disabling a link are audited operations that the
 * shared client has not surfaced yet.
 *
 * They are declared here as optional members rather than called through a cast
 * onto `create`, because calling the wrong endpoint would mint a second short
 * link instead of editing the one the user is looking at. Until the method
 * lands the mutation fails loudly with a state the screen already renders.
 *
 * TODO(web): depends on `@/lib/api` exposing `shortLinks.update` and
 * `shortLinks.setEnabled`.
 */
type ShortLinksApi = typeof api.shortLinks & {
  readonly update?: (input: UpdateDestinationInput) => Promise<unknown>;
  readonly setEnabled?: (input: SetLinkEnabledInput) => Promise<unknown>;
};

function shortLinks(): ShortLinksApi {
  return api.shortLinks as ShortLinksApi;
}

export interface UpdateDestinationInput {
  readonly shortLinkId: string;
  readonly destination: string;
  /** Recorded in the audit entry so the change has a stated purpose. */
  readonly reason: string;
  readonly idempotencyKey: string;
}

/**
 * Change where a published short URL sends people.
 *
 * Not optimistic. This edits something the public internet already has a copy
 * of, and the confirmation the user needs is that the server accepted it, not
 * that the browser drew it.
 */
export function useUpdateDestination() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateDestinationInput): Promise<TrackedLinkView> => {
      const update = shortLinks().update;
      if (!update) {
        throw new Error('shortLinks.update is not available in this client build');
      }
      return adapt<TrackedLinkView>(await update(input));
    },
    onSuccess: (_data, variables) => {
      void client.invalidateQueries({ queryKey: linkKeys.detail(variables.shortLinkId) });
      void client.invalidateQueries({ queryKey: linkKeys.all });
    },
  });
}

export interface SetLinkEnabledInput {
  readonly shortLinkId: string;
  readonly enabled: boolean;
  readonly reason: string;
  readonly idempotencyKey: string;
}

export function useSetLinkEnabled() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: SetLinkEnabledInput): Promise<TrackedLinkView> => {
      const setEnabled = shortLinks().setEnabled;
      if (!setEnabled) {
        throw new Error('shortLinks.setEnabled is not available in this client build');
      }
      return adapt<TrackedLinkView>(await setEnabled(input));
    },
    onSuccess: (_data, variables) => {
      void client.invalidateQueries({ queryKey: linkKeys.detail(variables.shortLinkId) });
      void client.invalidateQueries({ queryKey: linkKeys.all });
    },
  });
}
