import { canonicalJson, growthExportFormatSchema } from '@relay/contracts';
import type { GrowthExportFormat, GrowthPlan } from '@relay/contracts';

import { toMarkdown } from './markdown';
import type { PlanCatalog } from './markdown';
import { toYaml } from './yaml';

/**
 * One validated plan, three formats, all rendered by pure functions. There is
 * no second model call and no separate prose generator.
 *
 * Guarantees: JSON is the schema verbatim, YAML is the same object in block
 * style with no anchors or aliases, and Markdown is byte-identical for a fixed
 * plan. No secrets, no tokens, no internal identifiers beyond the public
 * prefixed ids, and no private source bodies.
 */

export interface GrowthExport {
  readonly contentType: string;
  readonly body: string;
  readonly format: GrowthExportFormat;
  readonly filename: string;
}

export interface ExportOptions {
  readonly format: GrowthExportFormat;
  readonly catalog: PlanCatalog;
}

const CONTENT_TYPES: Readonly<Record<GrowthExportFormat, string>> = Object.freeze({
  markdown: 'text/markdown; charset=utf-8',
  json: 'application/json; charset=utf-8',
  yaml: 'application/yaml; charset=utf-8',
});

const EXTENSIONS: Readonly<Record<GrowthExportFormat, string>> = Object.freeze({
  markdown: 'md',
  json: 'json',
  yaml: 'yaml',
});

/**
 * The plan as a plain, key-sorted JSON value. Sorting is what makes the JSON
 * and YAML exports byte stable across processes.
 */
export function planToCanonicalValue(plan: GrowthPlan): unknown {
  return JSON.parse(canonicalJson(plan));
}

export function exportGrowthPlan(plan: GrowthPlan, options: ExportOptions): GrowthExport {
  const format = growthExportFormatSchema.parse(options.format);
  const filename = `${plan.id}-r${plan.revision}.${EXTENSIONS[format]}`;

  if (format === 'json') {
    return {
      format,
      filename,
      contentType: CONTENT_TYPES.json,
      body: `${JSON.stringify(planToCanonicalValue(plan), null, 2)}\n`,
    };
  }
  if (format === 'yaml') {
    return {
      format,
      filename,
      contentType: CONTENT_TYPES.yaml,
      body: toYaml(planToCanonicalValue(plan)),
    };
  }
  return {
    format,
    filename,
    contentType: CONTENT_TYPES.markdown,
    body: toMarkdown(plan, options.catalog),
  };
}
