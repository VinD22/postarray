import { describe, expect, it } from 'vitest';

import { exportGrowthPlan, planToCanonicalValue } from './export.js';
import { toMarkdown } from './markdown.js';
import { fromYaml, toYaml, yamlScalar } from './yaml.js';
import { TEST_OPPORTUNITY_ID, makeOpportunity, makePlan, makeTool } from './testing.js';

const EMPTY_CATALOG = { opportunities: [], tools: [] };

describe('yaml emitter', () => {
  it('round trips a JSON shaped value', () => {
    const value = {
      alpha: 'a plain string',
      beta: 1,
      gamma: true,
      delta: null,
      list: ['one', 'two'],
      nested: { deep: { deeper: ['x'] } },
      objects: [{ a: 1, b: 'two' }, { a: 2, b: 'three' }],
      empty: [],
      emptyObject: {},
    };

    expect(fromYaml(toYaml(value))).toEqual(value);
  });

  it('quotes anything that could be read as another type', () => {
    expect(yamlScalar('true')).toBe('"true"');
    expect(yamlScalar('2026-08-04')).toBe('"2026-08-04"');
    expect(yamlScalar('has: colon')).toBe('"has: colon"');
    expect(yamlScalar('plain text')).toBe('plain text');
  });

  it('emits no anchors or aliases even for repeated values', () => {
    const shared = { same: 'value' };
    const yaml = toYaml({ first: shared, second: shared });
    expect(yaml).not.toContain('&');
    expect(yaml).not.toContain('*');
  });

  it('is deterministic', () => {
    const plan = planToCanonicalValue(makePlan());
    expect(toYaml(plan)).toBe(toYaml(plan));
  });
});

describe('exportGrowthPlan', () => {
  it('produces JSON that parses back to the plan', () => {
    const plan = makePlan();
    const result = exportGrowthPlan(plan, { format: 'json', catalog: EMPTY_CATALOG });

    expect(result.contentType).toContain('application/json');
    expect(JSON.parse(result.body)).toEqual(planToCanonicalValue(plan));
  });

  it('produces YAML that round trips to the same object as the JSON export', () => {
    const plan = makePlan();
    const json = exportGrowthPlan(plan, { format: 'json', catalog: EMPTY_CATALOG });
    const yaml = exportGrowthPlan(plan, { format: 'yaml', catalog: EMPTY_CATALOG });

    expect(fromYaml(yaml.body)).toEqual(JSON.parse(json.body));
  });

  it('produces byte identical Markdown for a fixed plan', () => {
    const plan = makePlan();
    const first = exportGrowthPlan(plan, { format: 'markdown', catalog: EMPTY_CATALOG });
    const second = exportGrowthPlan(plan, { format: 'markdown', catalog: EMPTY_CATALOG });

    expect(first.body).toBe(second.body);
  });

  it('names the file after the plan and its revision', () => {
    const plan = makePlan();
    expect(exportGrowthPlan(plan, { format: 'yaml', catalog: EMPTY_CATALOG }).filename).toBe(
      `${plan.id}-r${plan.revision}.yaml`,
    );
  });
});

describe('markdown exporter', () => {
  it('carries the provenance header and the standing disclaimer', () => {
    const markdown = toMarkdown(makePlan(), EMPTY_CATALOG);

    expect(markdown).toContain('| Plan ID |');
    expect(markdown).toContain('| Model |');
    expect(markdown).toContain('| Prompt version |');
    expect(markdown).toContain(
      'Recommendations are suggestions. Nothing in this file has been submitted, published or scheduled.',
    );
  });

  it('renders all nine sections with stable anchors', () => {
    const markdown = toMarkdown(makePlan(), EMPTY_CATALOG);

    for (const anchor of [
      'business-snapshot',
      'goals-and-metrics',
      'audiences-and-channels',
      'content-system',
      'ugc-plan',
      'opportunities',
      'tool-recommendations',
      'calendar-proposal',
      'risks-and-unknowns',
    ]) {
      expect(markdown).toContain(`<a id="${anchor}"></a>`);
    }
  });

  it('says an unknown baseline is unknown rather than zero', () => {
    const markdown = toMarkdown(makePlan(), EMPTY_CATALOG);
    expect(markdown).toContain('- Baseline: unknown');
    expect(markdown).not.toContain('- Baseline: 0');
  });

  it('states the honest empty state when the catalog has nothing to offer', () => {
    const markdown = toMarkdown(makePlan(), EMPTY_CATALOG);
    expect(markdown).toContain('An empty list is better than an invented one');
  });

  it('renders a catalog URL from the record with its verification date', () => {
    const plan = makePlan({
      opportunities: [
        {
          opportunityId: TEST_OPPORTUNITY_ID,
          fitExplanation: 'It reaches the same audience.',
          effort: 'low',
          requiredAsset: null,
          pitchDraft: 'A short, factual pitch.',
          evidenceIds: [TEST_OPPORTUNITY_ID],
          owner: null,
          status: 'proposed',
        },
      ],
    });
    const markdown = toMarkdown(plan, { opportunities: [makeOpportunity()], tools: [] });

    expect(markdown).toContain('[Example directory](https://directory.example.test)');
    expect(markdown).toContain('(verified 2026-08-01)');
  });

  it('marks a stale record instead of hiding it', () => {
    const plan = makePlan({
      opportunities: [
        {
          opportunityId: TEST_OPPORTUNITY_ID,
          fitExplanation: 'It reaches the same audience.',
          effort: 'low',
          requiredAsset: null,
          pitchDraft: 'A short, factual pitch.',
          evidenceIds: [TEST_OPPORTUNITY_ID],
          owner: null,
          status: 'proposed',
        },
      ],
    });
    const markdown = toMarkdown(plan, {
      opportunities: [makeOpportunity({ state: 'stale' })],
      tools: [],
    });

    expect(markdown).toContain('(Stale)');
  });

  it('labels an affiliate link without changing the order', () => {
    const plan = makePlan({
      tool_recommendations: [
        {
          toolId: makeTool().id,
          taskFit: 'It trims the clips this plan needs.',
          limitations: [],
          lastVerifiedAt: '2026-08-01T08:00:00Z',
          affiliate: { isAffiliate: true, disclosureKey: 'growth.tools.affiliateDisclosure' },
        },
      ],
    });
    const markdown = toMarkdown(plan, { opportunities: [], tools: [makeTool()] });

    expect(markdown).toContain('It does not change the ranking.');
  });

  it('never contains an em dash', () => {
    expect(toMarkdown(makePlan(), EMPTY_CATALOG)).not.toMatch(/[—–]/);
  });

  it('describes calendar rows as briefs rather than scheduled posts', () => {
    const markdown = toMarkdown(makePlan(), EMPTY_CATALOG);
    expect(markdown).toContain('These are briefs, not scheduled posts.');
  });
});
