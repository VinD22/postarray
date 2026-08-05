import type { GrowthPlan, OpportunityRecord, ToolRecord } from '@relay/contracts';

/**
 * The Markdown exporter.
 *
 * Deterministic: the same plan in, byte-identical file out. Heading anchors are
 * stable so a diff in source control stays readable. URLs are rendered here,
 * from catalog records the exporter looks up itself, with the verification date
 * next to the link. A model-authored string never becomes a hyperlink.
 */

export interface PlanCatalog {
  readonly opportunities: readonly OpportunityRecord[];
  readonly tools: readonly ToolRecord[];
}

/** Stable anchors, one per section, referenced by the table of contents. */
export const SECTION_ANCHORS: Readonly<Record<string, string>> = Object.freeze({
  business_snapshot: 'business-snapshot',
  goals_and_metrics: 'goals-and-metrics',
  audiences_and_channels: 'audiences-and-channels',
  content_system: 'content-system',
  ugc_plan: 'ugc-plan',
  opportunities: 'opportunities',
  tool_recommendations: 'tool-recommendations',
  calendar_proposal: 'calendar-proposal',
  risks_and_unknowns: 'risks-and-unknowns',
});

const DISCLAIMER =
  'Recommendations are suggestions. Nothing in this file has been submitted, published or scheduled.';

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
}

function heading(level: number, title: string, anchor: string): string[] {
  return [`<a id="${anchor}"></a>`, '', `${'#'.repeat(level)} ${title}`, ''];
}

function bullets(items: readonly string[], emptyNote: string): string[] {
  return items.length === 0 ? [`_${emptyNote}_`, ''] : [...items.map((item) => `- ${item}`), ''];
}

function catalogLink(
  name: string,
  officialUrl: string,
  lastVerifiedAt: string,
  state: string,
): string {
  const verified = lastVerifiedAt.slice(0, 10);
  const stale = state === 'stale' ? ' (Stale)' : '';
  return `[${name}](${officialUrl}) (verified ${verified})${stale}`;
}

function headerBlock(plan: GrowthPlan): string[] {
  return [
    '# Growth plan',
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Plan ID | \`${plan.id}\` |`,
    `| Plan revision | ${plan.revision} |`,
    `| Plan state | ${plan.state} |`,
    `| Schema version | ${plan.schemaVersion} |`,
    `| Business profile | \`${plan.business_snapshot.businessProfileId}\` revision ${plan.business_snapshot.businessProfileRevision} |`,
    `| Model | ${plan.model} |`,
    `| Prompt version | ${plan.promptVersion} |`,
    `| Generated at | ${plan.generatedAt} |`,
    '',
    `> ${DISCLAIMER}`,
    '',
    '## Contents',
    '',
    ...Object.entries(SECTION_ANCHORS).map(
      ([section, anchor], index) => `${index + 1}. [${section.replace(/_/g, ' ')}](#${anchor})`,
    ),
    '',
  ];
}

function businessSnapshot(plan: GrowthPlan): string[] {
  const snapshot = plan.business_snapshot;
  return [
    ...heading(2, 'Business snapshot', SECTION_ANCHORS.business_snapshot ?? 'business-snapshot'),
    '### Confirmed facts',
    '',
    ...bullets(
      snapshot.facts.map((fact) => `${fact.statement} (evidence: ${fact.evidenceIds.join(', ')})`),
      'No facts were confirmed.',
    ),
    '### Assumptions',
    '',
    ...bullets(
      snapshot.assumptions.map(
        (assumption) =>
          `Assumption (${assumption.confidence} confidence): ${assumption.statement}${assumption.needsConfirmation ? ' Needs confirmation.' : ''}`,
      ),
      'No assumptions were recorded.',
    ),
    '### Missing information',
    '',
    ...bullets(snapshot.missingInformation, 'Nothing was reported as missing.'),
  ];
}

function goalsAndMetrics(plan: GrowthPlan): string[] {
  const goals = plan.goals_and_metrics;
  const unknown = 'unknown';
  return [
    ...heading(2, 'Goals and metrics', SECTION_ANCHORS.goals_and_metrics ?? 'goals-and-metrics'),
    `- Objective: ${goals.objective}`,
    `- Conversion event: ${goals.conversionEvent}`,
    `- Baseline: ${goals.baseline === null ? unknown : goals.baseline}`,
    `- Target: ${goals.target === null ? unknown : goals.target}`,
    `- Window: ${goals.windowStart} to ${goals.windowEnd}`,
    '',
    '### Supporting metrics',
    '',
    ...bullets(goals.supportingMetrics, 'No supporting metrics were named.'),
  ];
}

function audiencesAndChannels(plan: GrowthPlan): string[] {
  const section = plan.audiences_and_channels;
  return [
    ...heading(
      2,
      'Audiences and channels',
      SECTION_ANCHORS.audiences_and_channels ?? 'audiences-and-channels',
    ),
    '### Audiences',
    '',
    '| Priority | Audience | Description |',
    '| --- | --- | --- |',
    ...[...section.audiences]
      .sort((left, right) => left.priority - right.priority)
      .map(
        (audience) =>
          `| ${audience.priority} | ${escapeCell(audience.name)} | ${escapeCell(audience.description)} |`,
      ),
    '',
    '### Channels',
    '',
    '| Priority | Platform | Why | Native formats | Limitations |',
    '| --- | --- | --- | --- | --- |',
    ...[...section.channels]
      .sort((left, right) => left.priority - right.priority)
      .map(
        (channel) =>
          `| ${channel.priority} | ${channel.provider} | ${escapeCell(channel.rationale)} | ${channel.nativeFormats.join(', ')} | ${escapeCell(channel.limitations.join('; '))} |`,
      ),
    '',
  ];
}

function contentSystem(plan: GrowthPlan): string[] {
  const system = plan.content_system;
  return [
    ...heading(2, 'Content system', SECTION_ANCHORS.content_system ?? 'content-system'),
    '### Pillars',
    '',
    ...system.pillars.flatMap((pillar) => [`- **${pillar.name}**: ${pillar.description}`]),
    '',
    '### Recurring series',
    '',
    ...bullets(
      system.series.map((series) => `${series.name} (${series.cadence})`),
      'No recurring series were proposed.',
    ),
    '### Calls to action',
    '',
    ...bullets(system.ctaLibrary, 'No calls to action were proposed.'),
    '### Weekly cadence',
    '',
    '| Platform | Posts per week |',
    '| --- | --- |',
    ...system.weeklyCadence.map((entry) => `| ${entry.provider} | ${entry.postsPerWeek} |`),
    '',
    '### Locale adaptations',
    '',
    ...bullets(
      system.localeAdaptations.map((entry) => `${entry.locale}: ${entry.notes}`),
      'No locale adaptations were needed.',
    ),
  ];
}

function ugcPlan(plan: GrowthPlan): string[] {
  const ugc = plan.ugc_plan;
  return [
    ...heading(2, 'UGC plan', SECTION_ANCHORS.ugc_plan ?? 'ugc-plan'),
    `- Goal: ${ugc.goal}`,
    `- Participants: ${ugc.participantProfile}`,
    `- Incentive: ${ugc.incentive ?? 'none'}`,
    `- Disclosure requirement: message key \`${ugc.disclosureKey}\``,
    `- Review workflow: ${ugc.reviewWorkflow}`,
    '',
    '### Prompt angles',
    '',
    ...bullets(ugc.promptAngles, 'No prompt angles were proposed.'),
    '### Brief for participants',
    '',
    ugc.brief,
    '',
    '### Rights and consent checklist',
    '',
    ...bullets(ugc.consentChecklist, 'No consent checklist was produced.'),
  ];
}

function opportunities(plan: GrowthPlan, catalog: PlanCatalog): string[] {
  const byId = new Map(catalog.opportunities.map((record) => [record.id, record]));
  const rows = plan.opportunities.map((match) => {
    const record = byId.get(match.opportunityId);
    const link =
      record === undefined
        ? '_record unavailable_'
        : catalogLink(record.name, record.officialUrl, record.lastVerifiedAt, record.state);
    const rules = record === undefined ? '' : escapeCell(record.rules.join('; '));
    return `| ${link} | ${escapeCell(match.fitExplanation)} | ${match.effort} | ${escapeCell(match.requiredAsset ?? 'none')} | ${rules} |`;
  });
  return [
    ...heading(2, 'Opportunities', SECTION_ANCHORS.opportunities ?? 'opportunities'),
    ...(rows.length === 0
      ? [
          '_No verified opportunities match this profile yet. An empty list is better than an invented one._',
          '',
        ]
      : [
          '| Listing | Why it fits | Effort | Required asset | Self promotion rules |',
          '| --- | --- | --- | --- | --- |',
          ...rows,
          '',
        ]),
    ...plan.opportunities.flatMap((match) => {
      const record = byId.get(match.opportunityId);
      return [
        `### Pitch draft: ${record === undefined ? match.opportunityId : record.name}`,
        '',
        match.pitchDraft,
        '',
      ];
    }),
  ];
}

function toolRecommendations(plan: GrowthPlan, catalog: PlanCatalog): string[] {
  const byId = new Map(catalog.tools.map((record) => [record.id, record]));
  const rows = plan.tool_recommendations.map((match) => {
    const record = byId.get(match.toolId);
    const link =
      record === undefined
        ? '_record unavailable_'
        : catalogLink(record.name, record.officialUrl, record.lastVerifiedAt, record.state);
    const price = record === undefined ? '' : escapeCell(record.priceModel);
    const affiliate = match.affiliate.isAffiliate
      ? 'Affiliate link. It does not change the ranking.'
      : '';
    return `| ${link} | ${escapeCell(match.taskFit)} | ${escapeCell(match.limitations.join('; '))} | ${price} | ${affiliate} |`;
  });
  return [
    ...heading(
      2,
      'Tool recommendations',
      SECTION_ANCHORS.tool_recommendations ?? 'tool-recommendations',
    ),
    ...(rows.length === 0
      ? ['_No verified tools match this plan yet._', '']
      : [
          '| Tool | Why it fits | Limitations | Price | Disclosure |',
          '| --- | --- | --- | --- | --- |',
          ...rows,
          '',
        ]),
  ];
}

function calendarProposal(plan: GrowthPlan): string[] {
  const rows = plan.calendar_proposal.flatMap((week) =>
    week.slots.map(
      (slot) =>
        `| ${week.weekNumber} | ${slot.date} | ${slot.provider} | ${escapeCell(slot.pillar)} | ${slot.contentKind} | ${slot.locale} | ${escapeCell(slot.briefSummary)} | ${slot.measurementTag} | ${slot.approvalRequired ? 'yes' : 'no'} |`,
    ),
  );
  return [
    ...heading(2, 'Calendar proposal', SECTION_ANCHORS.calendar_proposal ?? 'calendar-proposal'),
    'These are briefs, not scheduled posts. Accepting one creates a normal draft that still needs approval.',
    '',
    ...(rows.length === 0
      ? ['_No slots were proposed._', '']
      : [
          '| Week | Date | Platform | Pillar | Format | Locale | Brief | Measurement tag | Approval |',
          '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
          ...rows,
          '',
        ]),
  ];
}

function risksAndUnknowns(plan: GrowthPlan): string[] {
  const risks = plan.risks_and_unknowns;
  return [
    ...heading(2, 'Risks and unknowns', SECTION_ANCHORS.risks_and_unknowns ?? 'risks-and-unknowns'),
    '### Claims we could not support',
    '',
    ...bullets(risks.unsupportedClaims, 'None were reported.'),
    '### Missing permissions',
    '',
    ...bullets(risks.missingPermissions, 'None were reported.'),
    '### Catalog records excluded as stale',
    '',
    ...bullets(risks.staleCatalogRecordIds, 'None were excluded.'),
    '### Assumptions that need confirmation',
    '',
    ...bullets(
      risks.assumptionsRequiringConfirmation.map(
        (assumption) => `Assumption: ${assumption.statement} (${assumption.confidence} confidence)`,
      ),
      'None were reported.',
    ),
  ];
}

/** Render one validated plan. Pure, deterministic, no model call. */
export function toMarkdown(plan: GrowthPlan, catalog: PlanCatalog): string {
  const lines = [
    ...headerBlock(plan),
    ...businessSnapshot(plan),
    ...goalsAndMetrics(plan),
    ...audiencesAndChannels(plan),
    ...contentSystem(plan),
    ...ugcPlan(plan),
    ...opportunities(plan, catalog),
    ...toolRecommendations(plan, catalog),
    ...calendarProposal(plan),
    ...risksAndUnknowns(plan),
  ];
  return `${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()}\n`;
}
