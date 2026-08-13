import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { AGENT_TOOL_COUNT, AGENT_TOOL_TIERS, type AgentToolRisk } from './agent-tools';

/**
 * The home page's agent section names sixteen tools. This is what stops it
 * naming a seventeenth that does not exist, or keeping one that was deleted.
 *
 * `apps/web` cannot import `apps/mcp`, so the check is a source census in the
 * same spirit as `scene-budget.test.ts` and `inverted-band.test.ts`: read the
 * server's own README table off disk, parse it, and compare. When the MCP
 * server gains, loses or reclassifies a tool, this fails on that commit rather
 * than leaving a false claim on the public site until someone notices.
 *
 * The README is the right source rather than the TypeScript: `registry.test.ts`
 * in the MCP server already asserts the README table matches the definitions,
 * so pinning to the README pins to the definitions through it, without this
 * test needing to evaluate another app's module graph.
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const MCP_README = join(HERE, '../../../../../mcp/README.md');

/** `| \`list_accounts\` | read | \`accounts:read\` | 0 |` */
const TOOL_ROW = /^\|\s*`([a-z_]+)`\s*\|\s*\**([a-z]+)\**\s*\|/gm;

async function toolsFromServerReadme(): Promise<ReadonlyMap<string, AgentToolRisk>> {
  const source = await readFile(MCP_README, 'utf8');
  const rows = new Map<string, AgentToolRisk>();
  for (const match of source.matchAll(TOOL_ROW)) {
    const [, name, risk] = match;
    if (name === undefined || risk === undefined) continue;
    if (risk !== 'read' && risk !== 'reversible' && risk !== 'consequential') continue;
    rows.set(name, risk);
  }
  return rows;
}

describe('the agent tool ledger on the home page', () => {
  it('names every tool the MCP server defines, and no other', async () => {
    const server = await toolsFromServerReadme();
    expect(server.size).toBeGreaterThan(0);

    const shown = AGENT_TOOL_TIERS.flatMap((tier) => tier.tools);
    expect([...shown].sort()).toEqual([...server.keys()].sort());
    expect(AGENT_TOOL_COUNT).toBe(server.size);
  });

  it('files every tool under the risk the server declares for it', async () => {
    const server = await toolsFromServerReadme();
    for (const tier of AGENT_TOOL_TIERS) {
      for (const tool of tier.tools) {
        expect(server.get(tool), tool).toBe(tier.risk);
      }
    }
  });

  it('never lists the same tool twice', () => {
    const shown = AGENT_TOOL_TIERS.flatMap((tier) => tier.tools);
    expect(new Set(shown).size).toBe(shown.length);
  });
});
