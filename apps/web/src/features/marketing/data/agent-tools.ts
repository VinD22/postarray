/**
 * The MCP tool ledger, as the public site states it.
 *
 * Every name here is a real tool defined in `apps/mcp/src/tools/{read,
 * reversible,consequential}.ts` and listed in `apps/mcp/README.md`. The
 * marketing site cannot import that server (it is an app, not a package, and
 * `apps/web` may not reach past a package's public entrypoint), so the list is
 * restated here and then **pinned by a test**: `agent-tools.test.ts` reads the
 * README's tool table off disk and fails if this file names a tool the server
 * does not define, misses one it does, or files one under the wrong risk.
 *
 * That is the whole point of the file. A marketing page that lists agent tools
 * from memory is one refactor away from advertising a tool that does not
 * exist, which is the precise failure the house rules call a false capability
 * claim.
 *
 * Risk is the server's own vocabulary (`TOOL_RISKS` in
 * `apps/mcp/src/tools/registry.ts`), not a marketing simplification: it is the
 * property each tool declares, and the approval level and confirmation
 * requirement are enforced from that same declaration.
 */

export const AGENT_TOOL_RISKS = ['read', 'reversible', 'consequential'] as const;

export type AgentToolRisk = (typeof AGENT_TOOL_RISKS)[number];

export interface AgentToolTier {
  readonly risk: AgentToolRisk;
  /** Tool names, in the order the server's README lists them. */
  readonly tools: readonly string[];
}

export const AGENT_TOOL_TIERS: readonly AgentToolTier[] = [
  {
    risk: 'read',
    tools: [
      'list_accounts',
      'get_capabilities',
      'get_calendar',
      'preview_post',
      'validate_post',
      'get_post_status',
      'get_analytics',
      'get_growth_plan',
      'list_growth_opportunities',
    ],
  },
  {
    risk: 'reversible',
    tools: ['draft_post', 'request_approval', 'generate_growth_plan', 'create_campaign_from_plan'],
  },
  {
    risk: 'consequential',
    tools: ['schedule_post', 'publish_post', 'cancel_post'],
  },
];

/** Every tool the server exposes, flattened. Used for the count in the copy. */
export const AGENT_TOOL_COUNT = AGENT_TOOL_TIERS.reduce(
  (total, tier) => total + tier.tools.length,
  0,
);
