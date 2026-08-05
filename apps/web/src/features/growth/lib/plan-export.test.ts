import { describe, expect, it } from 'vitest';
import { growthPlanSchema } from '@relay/contracts';

import { SAMPLE_PLAN } from './plan-fixture.js';
import { toJson, toMarkdown, toYaml, type MarkdownLabels } from './plan-export.js';

const labels: MarkdownLabels = {
  section: { business_snapshot: 'Business snapshot' },
  title: 'Growth plan',
  version: 'Version 3, created 4 August 2026',
  facts: 'Facts you confirmed',
  assumptions: 'Assumptions we made',
  missing: 'Missing',
  objective: 'Objective',
  channels: 'Priority channels',
  pillars: 'Content pillars',
  cadence: 'Cadence',
  ctaLibrary: 'Calls to action',
  ugc: 'UGC campaign',
  opportunities: 'Promotion opportunities',
  tools: 'Tool radar',
  fourWeek: 'Four week plan',
  risks: 'Risks and unknowns',
  mediaBoundary: 'Why we do not generate images or video',
};

describe('the sample plan', () => {
  it('satisfies the shared growth plan schema', () => {
    expect(growthPlanSchema.safeParse(SAMPLE_PLAN).success).toBe(true);
  });
});

describe('toJson', () => {
  it('round trips through the schema unchanged', () => {
    const parsed: unknown = JSON.parse(toJson(SAMPLE_PLAN));
    expect(growthPlanSchema.safeParse(parsed).success).toBe(true);
    expect(parsed).toEqual(SAMPLE_PLAN);
  });

  it('ends with a newline so it is a well formed file', () => {
    expect(toJson(SAMPLE_PLAN).endsWith('\n')).toBe(true);
  });
});

describe('toYaml', () => {
  const yaml = toYaml(SAMPLE_PLAN);

  it('starts at the first key rather than a blank line', () => {
    expect(yaml.startsWith('id: plan_')).toBe(true);
  });

  it('nests a section under its key', () => {
    expect(yaml).toContain('business_snapshot:');
    expect(yaml).toContain('  businessProfileRevision: 2');
  });

  it('quotes a value that would otherwise read as a boolean or a number', () => {
    expect(toYaml({ ...SAMPLE_PLAN, model: 'true' })).toContain('model: "true"');
    expect(toYaml({ ...SAMPLE_PLAN, model: '123' })).toContain('model: "123"');
  });

  it('renders an empty list as an explicit empty sequence', () => {
    expect(yaml).toContain('opportunities: []');
  });

  it('carries no credential shaped value, because the plan schema has no such field', () => {
    expect(yaml.toLowerCase()).not.toContain('secret');
    expect(yaml.toLowerCase()).not.toContain('token');
  });
});

describe('toMarkdown', () => {
  const markdown = toMarkdown(SAMPLE_PLAN, labels);

  it('keeps facts and assumptions under separate headings', () => {
    const factsAt = markdown.indexOf(labels.facts);
    const assumptionsAt = markdown.indexOf(labels.assumptions);
    expect(factsAt).toBeGreaterThan(-1);
    expect(assumptionsAt).toBeGreaterThan(factsAt);
    expect(markdown).toContain('Buyers are operations leads');
  });

  it('marks an assumption with its confidence so it cannot read as a fact', () => {
    expect(markdown).toContain('(medium)');
  });

  it('renders the four week plan as a table, not as a list of cards', () => {
    expect(markdown).toContain('| Week | Date | Channel |');
    expect(markdown).toContain('| 1 | 2026-08-11 | linkedin |');
  });

  it('renders the consent checklist as checkboxes a person can work through', () => {
    expect(markdown).toContain('- [ ] Written permission to publish the clip.');
  });

  it('escapes a pipe so one brief cannot break the table', () => {
    const withPipe = structuredClone(SAMPLE_PLAN);
    const slot = withPipe.calendar_proposal[0]?.slots[0];
    if (slot === undefined) {
      throw new Error('fixture must have a slot');
    }
    const mutable = withPipe.calendar_proposal[0]?.slots as unknown as { briefSummary: string }[];
    mutable[0] = { ...slot, briefSummary: 'Before | after' };
    expect(toMarkdown(withPipe, labels)).toContain('Before \\| after');
  });
});
