import { RelayError, webUrlSchema } from '@relay/contracts';

import { ROUTES } from '../api/routes';
import { shortLinkStatsSchema, shortLinkViewSchema } from '../api/schemas';
import type { CliContext } from '../context';
import { renderPlan, renderSuccess, renderTable } from '../output';
import type { PlannedExternalAction, RenderInput } from '../output';

/**
 * `relay links`.
 *
 * Creating a short link is reversible but it does mint a public URL, so it
 * takes an idempotency key and honours `--dry-run`. The destination safety
 * check itself lives on the server: a client-side check that the server did not
 * repeat would be decoration.
 */

export interface LinkCreateOptions {
  readonly destination: string;
  readonly campaignId?: string | undefined;
  readonly domainId?: string | undefined;
  readonly utmSource?: string | undefined;
  readonly utmMedium?: string | undefined;
  readonly utmCampaign?: string | undefined;
  readonly utmTerm?: string | undefined;
  readonly utmContent?: string | undefined;
  readonly idempotencyKey?: string | undefined;
}

function utmFrom(options: LinkCreateOptions): Record<string, string> | null {
  const entries = Object.entries({
    source: options.utmSource,
    medium: options.utmMedium,
    campaign: options.utmCampaign,
    term: options.utmTerm,
    content: options.utmContent,
  }).filter((entry): entry is [string, string] => entry[1] !== undefined);
  return entries.length === 0 ? null : Object.fromEntries(entries);
}

export async function linksCreate(
  context: CliContext,
  render: RenderInput,
  options: LinkCreateOptions,
): Promise<void> {
  const destination = webUrlSchema.safeParse(options.destination);
  if (!destination.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'DESTINATION_MALFORMED' },
    });
  }

  const utm = utmFrom(options);
  const body = {
    destinationUrl: destination.data,
    campaignId: options.campaignId ?? null,
    domainId: options.domainId ?? null,
    utm,
  };

  if (context.options.dryRun) {
    const plan: readonly PlannedExternalAction[] = [
      {
        action: 'create_short_link',
        provider: 'relay',
        connectionId: '',
        accountLabel: options.domainId ?? 'default-domain',
        whenInstant: null,
        ianaTimeZone: null,
        requiresApproval: false,
        requiresHumanConfirmation: false,
        estimatedCostMinor: null,
        currency: null,
      },
    ];
    renderSuccess(
      { ...render, plannedExternalActions: plan },
      { dryRun: true, request: body, plannedExternalActions: plan },
      renderPlan(plan),
    );
    return;
  }

  if (options.idempotencyKey === undefined) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'IDEMPOTENCY_KEY_REQUIRED' },
    });
  }

  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.shortLinks(),
    schema: shortLinkViewSchema,
    body,
    idempotencyKey: options.idempotencyKey,
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['field', 'value'],
      [
        ['linkId', response.data.id],
        ['slug', response.data.slug],
        ['domain', response.data.domain ?? 'default'],
        ['shortUrl', response.data.shortUrl],
        ['destinationUrl', response.data.destinationUrl],
        ['state', response.data.state],
        ['expiresAt', response.data.expiresAt ?? 'never'],
      ],
    ),
  ]);
}

export async function linksStats(
  context: CliContext,
  render: RenderInput,
  linkId: string,
  options: { readonly from?: string | undefined; readonly to?: string | undefined },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.shortLinkStats(linkId),
    schema: shortLinkStatsSchema,
    query: { from: options.from, to: options.to },
  });
  const stats = response.data;

  /**
   * These are first-party redirect measurements. They are a different series
   * from a provider's own reported link clicks and are never presented as the
   * same number.
   */
  renderSuccess({ ...render, correlationId: response.correlationId }, stats, [
    `sourceKey=${stats.sourceKey}`,
    ...renderTable(
      ['field', 'value'],
      [
        ['linkId', stats.linkId],
        ['totalClicks', String(stats.totalClicks)],
        ['humanClicks', String(stats.humanClicks)],
        ['suspectedBotClicks', String(stats.suspectedBotClicks)],
      ],
    ),
    '',
    ...renderTable(
      ['country', 'clicks'],
      stats.topCountries.map((row) => [row.countryCode, String(row.clicks)]),
    ),
    '',
    ...renderTable(
      ['referrer', 'clicks'],
      stats.topReferrerClasses.map((row) => [row.referrerClass, String(row.clicks)]),
    ),
    '',
    ...renderTable(
      ['bucketStart', 'clicks'],
      stats.series.map((row) => [row.bucketStart, String(row.clicks)]),
    ),
  ]);
}
