import type { RlsTransactionClient } from '../tenancy/rls-context.js';

import { hoursAgo, seedId } from './ids.js';

/**
 * Global reference data: metric definitions plus the two operator-curated
 * catalogs the Growth Advisor is allowed to recommend from.
 *
 * Every catalog record here is unmistakably synthetic. The URLs are on
 * `example.test`, a reserved domain that can never resolve, and the names say
 * "sample". That is deliberate and it is a rule, not a placeholder to fill in
 * later: a seeded catalog entry that looks like a real directory, a real
 * publication or a real tool would end up in a screenshot, a demo or a
 * customer's plan, and we would be recommending something nobody verified.
 * Real entries arrive only through the admin catalog workflow, with an official
 * URL, submission rules and a verification date.
 */

export const SEED_TOOL_IDS = {
  imageEditor: seedId('tool:sample-image-editor'),
  captionResearch: seedId('tool:sample-caption-research'),
  workflowAutomation: seedId('tool:sample-workflow-automation'),
} as const;

export const SEED_OPPORTUNITY_IDS = {
  directory: seedId('opportunity:sample-directory'),
  community: seedId('opportunity:sample-community'),
  newsletter: seedId('opportunity:sample-newsletter'),
} as const;

export const SEED_METRIC_IDS = {
  impressions: seedId('metric:fake:impressions'),
  reach: seedId('metric:fake:reach'),
  likes: seedId('metric:fake:likes'),
  comments: seedId('metric:fake:comments'),
  shares: seedId('metric:fake:shares'),
  linkClicks: seedId('metric:fake:link_clicks'),
} as const;

export async function seedGlobalCatalogs(tx: RlsTransactionClient): Promise<void> {
  await seedMetricDefinitions(tx);
  await seedToolCatalog(tx);
  await seedOpportunities(tx);
}

async function seedMetricDefinitions(tx: RlsTransactionClient): Promise<void> {
  const verifiedAt = hoursAgo(24);

  const definitions = [
    {
      id: SEED_METRIC_IDS.impressions,
      providerFieldName: 'impression_count',
      providerDefinition:
        'Number of times the simulator rendered the post in a timeline. Counts repeat renders to the same viewer.',
      normalizedName: 'impressions',
      unit: 'count' as const,
      availability: 'available' as const,
      denominatorNote: null,
    },
    {
      id: SEED_METRIC_IDS.reach,
      providerFieldName: 'unique_viewer_count',
      providerDefinition: 'Distinct simulated viewers. Not comparable with impressions.',
      normalizedName: 'reach',
      unit: 'count' as const,
      availability: 'available' as const,
      denominatorNote: 'Reach is the denominator the fake provider uses for engagement rate.',
    },
    {
      id: SEED_METRIC_IDS.likes,
      providerFieldName: 'like_count',
      providerDefinition: 'Simulated positive reactions.',
      normalizedName: 'likes',
      unit: 'count' as const,
      availability: 'available' as const,
      denominatorNote: null,
    },
    {
      id: SEED_METRIC_IDS.comments,
      providerFieldName: 'reply_count',
      providerDefinition: 'Simulated replies to the root post, excluding replies to replies.',
      normalizedName: 'comments',
      unit: 'count' as const,
      availability: 'available' as const,
      denominatorNote: null,
    },
    {
      id: SEED_METRIC_IDS.shares,
      providerFieldName: 'repost_count',
      providerDefinition: 'Simulated reposts. Quote reposts are counted separately and not exposed.',
      normalizedName: 'shares',
      unit: 'count' as const,
      availability: 'available' as const,
      denominatorNote: null,
    },
    {
      // Present on purpose so the UI has something to render as "unavailable"
      // rather than as a zero.
      id: SEED_METRIC_IDS.linkClicks,
      providerFieldName: 'link_click_count',
      providerDefinition:
        'Not returned by the fake provider. Use first-party short link clicks, which measure a different thing.',
      normalizedName: 'link_clicks',
      unit: 'count' as const,
      availability: 'unsupported' as const,
      denominatorNote: null,
    },
  ];

  for (const definition of definitions) {
    const { denominatorNote, ...rest } = definition;
    await tx.metricDefinition.upsert({
      where: { id: definition.id },
      create: {
        ...rest,
        provider: 'fake',
        aggregationRule: 'latest_snapshot',
        appliesToPost: true,
        appliesToAccount: false,
        derivationRestricted: false,
        lastVerifiedAt: verifiedAt,
        ...(denominatorNote === null ? {} : { denominatorNote }),
      },
      update: {
        providerDefinition: definition.providerDefinition,
        availability: definition.availability,
        lastVerifiedAt: verifiedAt,
      },
    });
  }
}

async function seedToolCatalog(tx: RlsTransactionClient): Promise<void> {
  const verifiedAt = hoursAgo(72);

  interface ToolSeed {
    readonly id: string;
    readonly name: string;
    readonly officialUrl: string;
    readonly category: 'image_editing' | 'research' | 'automation';
    readonly summary: string;
    readonly useCases: string[];
    readonly inputs: string[];
    readonly outputs: string[];
    readonly priceModel: string;
    readonly priceNote: string;
    readonly rightsCaveats: string;
    readonly privacyCaveats: string;
    readonly limitations: string;
    readonly integrations: string[];
    readonly isAffiliate: boolean;
    readonly affiliateDisclosure?: string;
  }

  const tools: readonly ToolSeed[] = [
    {
      id: SEED_TOOL_IDS.imageEditor,
      name: 'Sample Image Editor (seed record)',
      officialUrl: 'https://tools.example.test/sample-image-editor',
      category: 'image_editing' as const,
      summary:
        'Placeholder catalog record used by the local seed. Replace it through the admin catalog workflow before showing anything to a customer.',
      useCases: ['crop to platform aspect ratios', 'export a thumbnail', 'compress before upload'],
      inputs: ['png', 'jpeg', 'webp'],
      outputs: ['png', 'jpeg', 'webp'],
      priceModel: 'unknown',
      priceNote: 'Seed record. No price has been verified.',
      rightsCaveats: 'Seed record. Rights terms have not been reviewed.',
      privacyCaveats: 'Seed record. Data handling has not been reviewed.',
      limitations: 'This entry exists so the empty state can be exercised. It is not a recommendation.',
      integrations: [],
      isAffiliate: false,
    },
    {
      id: SEED_TOOL_IDS.captionResearch,
      name: 'Sample Caption Research (seed record)',
      officialUrl: 'https://tools.example.test/sample-caption-research',
      category: 'research' as const,
      summary:
        'Placeholder catalog record used by the local seed. It demonstrates the research workflow handoff and nothing else.',
      useCases: ['collect reference posts', 'summarize a topic before drafting'],
      inputs: ['topic', 'url list'],
      outputs: ['notes', 'csv'],
      priceModel: 'unknown',
      priceNote: 'Seed record. No price has been verified.',
      rightsCaveats: 'Seed record. Rights terms have not been reviewed.',
      privacyCaveats: 'Seed record. Data handling has not been reviewed.',
      limitations: 'Not a recommendation. Replace before launch.',
      integrations: [],
      isAffiliate: false,
    },
    {
      id: SEED_TOOL_IDS.workflowAutomation,
      name: 'Sample Workflow Automation (seed record)',
      officialUrl: 'https://tools.example.test/sample-workflow-automation',
      category: 'automation' as const,
      summary:
        'Placeholder catalog record used by the local seed to exercise affiliate disclosure rendering.',
      useCases: ['trigger a draft from an inbound webhook'],
      inputs: ['webhook'],
      outputs: ['webhook'],
      priceModel: 'unknown',
      priceNote: 'Seed record. No price has been verified.',
      rightsCaveats: 'Seed record. Rights terms have not been reviewed.',
      privacyCaveats: 'Seed record. Data handling has not been reviewed.',
      limitations: 'Not a recommendation. Replace before launch.',
      integrations: ['webhooks'],
      isAffiliate: true,
      affiliateDisclosure:
        'Seed record used to check that the disclosure line renders. No commercial relationship exists.',
    },
  ];

  for (const tool of tools) {
    await tx.toolCatalogEntry.upsert({
      where: { id: tool.id },
      create: {
        ...tool,
        state: 'active',
        lastVerifiedAt: verifiedAt,
        nextReviewAt: new Date(verifiedAt.getTime() + 90 * 24 * 60 * 60 * 1000),
        changeLog: [{ at: verifiedAt.toISOString(), change: 'seeded' }],
      },
      update: { state: 'active', lastVerifiedAt: verifiedAt },
    });
  }
}

async function seedOpportunities(tx: RlsTransactionClient): Promise<void> {
  const verifiedAt = hoursAgo(96);

  interface OpportunitySeed {
    readonly id: string;
    readonly kind: 'directory' | 'community' | 'newsletter';
    readonly name: string;
    readonly officialUrl: string;
    readonly description: string;
    readonly audience: string;
    readonly regions: string[];
    readonly categories: string[];
    readonly submissionMethod: string;
    readonly submissionRules: string;
    readonly costMinor: number;
    readonly selfPromotionAllowed: boolean;
    readonly disclosureRules?: string;
  }

  const opportunities: readonly OpportunitySeed[] = [
    {
      id: SEED_OPPORTUNITY_IDS.directory,
      kind: 'directory' as const,
      name: 'Sample Product Directory (seed record)',
      officialUrl: 'https://directory.example.test/submit',
      description:
        'Placeholder directory used by the local seed. It exists to exercise the match and submission-guidance UI.',
      audience: 'Seed audience. Not verified.',
      regions: ['global'],
      categories: ['software'],
      submissionMethod: 'manual_form',
      submissionRules:
        'Seed record. Relay never submits a listing on a user behalf, and never creates an account for one.',
      costMinor: 0,
      selfPromotionAllowed: true,
    },
    {
      id: SEED_OPPORTUNITY_IDS.community,
      kind: 'community' as const,
      name: 'Sample Practitioner Community (seed record)',
      officialUrl: 'https://community.example.test/guidelines',
      description:
        'Placeholder community used by the local seed to show a strict self-promotion rule.',
      audience: 'Seed audience. Not verified.',
      regions: ['global'],
      categories: ['marketing'],
      submissionMethod: 'participate_then_share',
      submissionRules:
        'Seed record. Self promotion is not allowed here, which is exactly the case the UI must surface before a user acts.',
      costMinor: 0,
      selfPromotionAllowed: false,
    },
    {
      id: SEED_OPPORTUNITY_IDS.newsletter,
      kind: 'newsletter' as const,
      name: 'Sample Industry Newsletter (seed record)',
      officialUrl: 'https://newsletter.example.test/pitch',
      description:
        'Placeholder newsletter used by the local seed to show a paid-placement disclosure requirement.',
      audience: 'Seed audience. Not verified.',
      regions: ['global'],
      categories: ['software'],
      submissionMethod: 'email_pitch',
      submissionRules:
        'Seed record. Paid placement is disclosed as advertising and is never presented as editorial coverage.',
      costMinor: 0,
      selfPromotionAllowed: true,
      disclosureRules: 'Paid placement must be labelled. Relay never buys or exchanges links.',
    },
  ];

  for (const opportunity of opportunities) {
    await tx.growthOpportunity.upsert({
      where: { id: opportunity.id },
      create: {
        ...opportunity,
        costCurrency: 'USD',
        sourceNote: 'Local seed data. Replace through the admin catalog import.',
        state: 'active',
        lastVerifiedAt: verifiedAt,
        nextReviewAt: new Date(verifiedAt.getTime() + 90 * 24 * 60 * 60 * 1000),
        changeLog: [{ at: verifiedAt.toISOString(), change: 'seeded' }],
      },
      update: { state: 'active', lastVerifiedAt: verifiedAt },
    });
  }
}
