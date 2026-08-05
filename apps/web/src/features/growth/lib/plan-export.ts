/**
 * The three export views of one plan.
 *
 * Markdown is for a person, JSON is for a machine, YAML is for a repository.
 * All three are generated from the same validated `GrowthPlan` object, so they
 * cannot disagree, and none of them can contain a secret because the plan
 * schema has no field that could hold one.
 *
 * The server also renders these, and the client copy uses the server output
 * where it is available. These functions exist so the preview is instant and
 * so a copy still works when the export endpoint is slow.
 */

import { GROWTH_PLAN_SECTIONS, type GrowthPlan } from '@relay/contracts';

export function toJson(plan: GrowthPlan): string {
  return `${JSON.stringify(plan, null, 2)}\n`;
}

/** Minimal YAML: no anchors, no flow style, no tags. Round trips through JSON. */
export function toYaml(plan: GrowthPlan): string {
  return `${yamlValue(plan as unknown, 0).replace(/^\n/, '')}\n`;
}

function yamlValue(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);

  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'string') {
    return yamlScalar(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    return value
      .map((entry) => {
        const rendered = yamlValue(entry, indent + 1);
        return rendered.startsWith('\n')
          ? `${pad}-${rendered}`
          : `${pad}- ${rendered.trimStart()}`;
      })
      .join('\n')
      .replace(/^/, '\n');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }
    return entries
      .map(([key, entryValue]) => {
        const rendered = yamlValue(entryValue, indent + 1);
        return rendered.startsWith('\n')
          ? `${pad}${key}:${rendered}`
          : `${pad}${key}: ${rendered}`;
      })
      .join('\n')
      .replace(/^/, '\n');
  }
  return 'null';
}

function yamlScalar(value: string): string {
  if (value.includes('\n')) {
    const lines = value.split('\n').map((line) => `  ${line}`);
    return `|-\n${lines.join('\n')}`;
  }
  const needsQuotes =
    value.length === 0 ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(value) ||
    /: |\s#|^\s|\s$/.test(value) ||
    ['true', 'false', 'null', 'yes', 'no', 'on', 'off'].includes(value.toLowerCase()) ||
    /^-?\d+(\.\d+)?$/.test(value);
  return needsQuotes ? JSON.stringify(value) : value;
}

export interface MarkdownLabels {
  /** Section heading per plan section, already translated. */
  readonly section: Readonly<Record<string, string>>;
  readonly title: string;
  readonly version: string;
  readonly facts: string;
  readonly assumptions: string;
  readonly missing: string;
  readonly objective: string;
  readonly channels: string;
  readonly pillars: string;
  readonly cadence: string;
  readonly ctaLibrary: string;
  readonly ugc: string;
  readonly opportunities: string;
  readonly tools: string;
  readonly fourWeek: string;
  readonly risks: string;
  readonly mediaBoundary: string;
}

/** A plan a person can read, paste into a document and hand to a colleague. */
export function toMarkdown(plan: GrowthPlan, labels: MarkdownLabels): string {
  const lines: string[] = [];

  lines.push(`# ${labels.title}`);
  lines.push('');
  lines.push(labels.version);
  lines.push('');

  lines.push(`## ${labels.section.business_snapshot ?? 'business_snapshot'}`);
  lines.push('');
  lines.push(`### ${labels.facts}`);
  for (const fact of plan.business_snapshot.facts) {
    lines.push(`- ${fact.statement}`);
  }
  lines.push('');
  lines.push(`### ${labels.assumptions}`);
  for (const assumption of plan.business_snapshot.assumptions) {
    lines.push(`- ${assumption.statement} (${assumption.confidence})`);
  }
  lines.push('');
  lines.push(`### ${labels.missing}`);
  for (const missing of plan.business_snapshot.missingInformation) {
    lines.push(`- ${missing}`);
  }
  lines.push('');

  lines.push(`## ${labels.objective}`);
  lines.push('');
  lines.push(plan.goals_and_metrics.objective);
  lines.push('');

  lines.push(`## ${labels.channels}`);
  lines.push('');
  for (const channel of plan.audiences_and_channels.channels) {
    lines.push(`${channel.priority}. ${channel.provider}: ${channel.rationale}`);
    for (const limitation of channel.limitations) {
      lines.push(`   - ${limitation}`);
    }
  }
  lines.push('');

  lines.push(`## ${labels.pillars}`);
  lines.push('');
  for (const pillar of plan.content_system.pillars) {
    lines.push(`- **${pillar.name}**: ${pillar.description}`);
  }
  lines.push('');

  lines.push(`## ${labels.cadence}`);
  lines.push('');
  for (const entry of plan.content_system.weeklyCadence) {
    lines.push(`- ${entry.provider}: ${entry.postsPerWeek}`);
  }
  lines.push('');

  lines.push(`## ${labels.ctaLibrary}`);
  lines.push('');
  for (const cta of plan.content_system.ctaLibrary) {
    lines.push(`- ${cta}`);
  }
  lines.push('');

  lines.push(`## ${labels.fourWeek}`);
  lines.push('');
  lines.push('| Week | Date | Channel | Pillar | Format | Brief | Measurement |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const week of plan.calendar_proposal) {
    for (const slot of week.slots) {
      lines.push(
        `| ${week.weekNumber} | ${slot.date} | ${slot.provider} | ${escapePipes(slot.pillar)} | ${slot.contentKind} | ${escapePipes(slot.briefSummary)} | ${escapePipes(slot.measurementTag)} |`,
      );
    }
  }
  lines.push('');

  lines.push(`## ${labels.ugc}`);
  lines.push('');
  lines.push(plan.ugc_plan.goal);
  lines.push('');
  for (const [index, angle] of plan.ugc_plan.promptAngles.entries()) {
    lines.push(`${index + 1}. ${angle}`);
  }
  lines.push('');
  for (const item of plan.ugc_plan.consentChecklist) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push('');

  lines.push(`## ${labels.opportunities}`);
  lines.push('');
  for (const match of plan.opportunities) {
    lines.push(`- ${match.opportunityId}: ${match.fitExplanation} (${match.effort})`);
  }
  lines.push('');

  lines.push(`## ${labels.tools}`);
  lines.push('');
  for (const tool of plan.tool_recommendations) {
    lines.push(`- ${tool.toolId}: ${tool.taskFit}`);
    for (const limitation of tool.limitations) {
      lines.push(`  - ${limitation}`);
    }
  }
  lines.push('');

  lines.push(`## ${labels.risks}`);
  lines.push('');
  for (const claim of plan.risks_and_unknowns.unsupportedClaims) {
    lines.push(`- ${claim}`);
  }
  lines.push('');

  lines.push(`## ${labels.mediaBoundary}`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function escapePipes(value: string): string {
  return value.replace(/\|/g, '\\|');
}

/** Every section the schema defines, so an export can never silently drop one. */
export const EXPORTED_SECTIONS = GROWTH_PLAN_SECTIONS;
