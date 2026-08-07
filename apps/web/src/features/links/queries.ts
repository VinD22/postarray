'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { ShortLinkStats, ShortLinkView } from '@/lib/api';

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
  stats: (
    linkId: string,
    range: { readonly start: string; readonly end: string },
    ianaTimeZone: string,
  ) => ['links', 'detail', linkId, range, ianaTimeZone] as const,
};

export interface LinkListQuery {
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
}

function adaptLink(value: ShortLinkView): TrackedLinkView {
  return {
    id: value.id,
    slug: value.slug,
    shortUrl: value.shortUrl,
    domain: value.domain,
    destination: value.destinationUrl,
    destinationHistory: value.destinationHistory,
    campaign: value.campaignId,
    utm: value.utm,
    state: value.state,
    createdAt: value.createdAt,
    createdByUserId: value.createdByUserId,
    expiresAt: value.expiresAt,
    disabledAt: value.disabledAt,
  };
}

function breakdown(
  rows: readonly { readonly key: string; readonly clicks: number }[],
  total: number,
) {
  return rows.map((row) => ({
    key: row.key,
    clicks: row.clicks,
    share: total === 0 ? 0 : row.clicks / total,
  }));
}

function adaptMeasurement(
  value: ShortLinkStats,
  range: { readonly start: string; readonly end: string },
): RedirectMeasurement {
  return {
    linkId: value.linkId,
    periodStart: range.start,
    periodEnd: range.end,
    totalRequests: value.totalClicks,
    deduplicatedClicks: value.humanClicks,
    suspectedBots: value.suspectedBotClicks,
    lastEventAt: value.lastEventAt,
    referrers: breakdown(
      value.topReferrerClasses.map((row) => ({ key: row.referrerClass, clicks: row.clicks })),
      value.humanClicks,
    ),
    devices: breakdown(
      value.topDeviceClasses.map((row) => ({ key: row.deviceClass, clicks: row.clicks })),
      value.humanClicks,
    ),
    countries: breakdown(
      value.topCountries.map((row) => ({ key: row.countryCode, clicks: row.clicks })),
      value.humanClicks,
    ),
    series: value.series.map((point) => ({
      bucketStart: point.bucketStart,
      bucketSeconds: 3600,
      requests: point.requests,
      clicks: null,
    })),
  };
}

export function useTrackedLinks(query: LinkListQuery = {}) {
  return useQuery({
    queryKey: linkKeys.list(query),
    staleTime: ONE_MINUTE,
    queryFn: async () => {
      const result = await api.shortLinks.list(query);
      return { ...result, data: result.data.map(adaptLink) };
    },
  });
}

export function useLinkStats(
  linkId: string,
  range: { readonly start: string; readonly end: string },
  ianaTimeZone: string,
  enabled = true,
) {
  return useQuery({
    queryKey: linkKeys.stats(linkId, range, ianaTimeZone),
    enabled,
    staleTime: ONE_MINUTE,
    queryFn: async () => {
      const [link, measurement] = await Promise.all([
        api.shortLinks.get(linkId),
        api.shortLinks.getStats(linkId, {
          from: range.start,
          to: range.end,
          ianaTimeZone,
        }),
      ]);
      if (link === null || measurement === null) {
        throw new Error('SHORT_LINK_NOT_AVAILABLE');
      }
      return { link: adaptLink(link), measurement: adaptMeasurement(measurement, range) };
    },
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
    mutationFn: async (input: CreateLinkInput): Promise<TrackedLinkView> => {
      const created = await api.shortLinks.create(
        {
          destinationUrl: input.destination,
          ...(input.campaign === null ? {} : { campaignId: input.campaign }),
          ...(input.domainId === null ? {} : { domainId: input.domainId }),
          ...(input.slug === null ? {} : { slug: input.slug }),
          ...(Object.keys(input.utm).length === 0 ? {} : { utm: input.utm }),
          ...(input.expiresAt === null ? {} : { expiresAt: input.expiresAt }),
        },
        input.idempotencyKey,
      );
      if (created === null) {
        throw new Error('SHORT_LINK_NOT_CREATED');
      }
      return adaptLink(created);
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: linkKeys.all });
    },
  });
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
      const updated = await api.shortLinks.updateDestination(
        input.shortLinkId,
        { destinationUrl: input.destination, reason: input.reason },
        input.idempotencyKey,
      );
      if (updated === null) {
        throw new Error('SHORT_LINK_NOT_UPDATED');
      }
      return adaptLink(updated);
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
      const updated = await api.shortLinks.setEnabled(
        input.shortLinkId,
        { enabled: input.enabled, reason: input.reason },
        input.idempotencyKey,
      );
      if (updated === null) {
        throw new Error('SHORT_LINK_STATE_NOT_UPDATED');
      }
      return adaptLink(updated);
    },
    onSuccess: (_data, variables) => {
      void client.invalidateQueries({ queryKey: linkKeys.detail(variables.shortLinkId) });
      void client.invalidateQueries({ queryKey: linkKeys.all });
    },
  });
}
