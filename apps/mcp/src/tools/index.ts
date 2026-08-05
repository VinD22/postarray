import { createRegistry } from './registry';
import type { ToolDefinition, ToolRegistry } from './registry';
import { READ_TOOLS } from './read';
import { REVERSIBLE_TOOLS } from './reversible';
import { CONSEQUENTIAL_TOOLS } from './consequential';

/**
 * The complete tool set. Exactly these, in this order.
 *
 * Adding a tool is a deliberate act: it needs a risk, a scope, an approval
 * level and a truthful side effect sentence, and the registry test below fails
 * if any of those disagree with what the tool actually does.
 */
export const ALL_TOOLS: readonly ToolDefinition[] = [
  ...READ_TOOLS,
  ...REVERSIBLE_TOOLS,
  ...CONSEQUENTIAL_TOOLS,
];

export const TOOL_NAMES: readonly string[] = ALL_TOOLS.map((tool) => tool.name);

export function createToolRegistry(tools: readonly ToolDefinition[] = ALL_TOOLS): ToolRegistry {
  return createRegistry(tools);
}

export {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  RESOURCE_URIS,
  TOOL_RISKS,
  createRegistry,
  defineTool,
  describeTool,
  idempotencyInputShape,
  pageInputShape,
  requirementOf,
  resourceLink,
  type ResourceLink,
  type ToolContext,
  type ToolDefinition,
  type ToolRegistry,
  type ToolResult,
  type ToolRisk,
} from './registry';

export { READ_TOOLS } from './read';
export { REVERSIBLE_TOOLS } from './reversible';
export { CONSEQUENTIAL_TOOLS } from './consequential';
