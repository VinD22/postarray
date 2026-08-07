import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] as const;
const BLOCKING_IMPACTS = new Set(['serious', 'critical']);

export async function expectNoBlockingAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags([...WCAG_AA_TAGS]).analyze();

  await testInfo.attach('axe-results', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const blocking = results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ''))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.flatMap((node) => node.target),
    }));

  expect(blocking, 'Serious and critical WCAG A/AA violations').toEqual([]);
}
