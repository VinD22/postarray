import { z } from 'zod';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import type { ProblemJson } from '@relay/contracts';

import { problemMessage, toolTitle } from './copy';
import { describeField } from './tools/field-descriptions';
import { describeTool } from './tools/registry';
import type { ToolDefinition, ToolRegistry, ToolResult } from './tools/registry';
import type { Dispatcher } from './dispatch';
import type { VerifiedGrant } from './auth/verifier';

/**
 * The MCP protocol layer.
 *
 * It is thin by design. It converts a `tools/list` into declarations and a
 * `tools/call` into a dispatch, and it owns no policy: the dispatcher does the
 * verification, the authorization and the audit, so there is exactly one place
 * those can be got wrong.
 *
 * Tool schemas are generated with `z.toJSONSchema` rather than handed to the
 * SDK as Zod objects, which keeps this file independent of whichever Zod major
 * the SDK happens to depend on.
 */

export const SERVER_NAME = 'postarray';
export const SERVER_VERSION = '0.2.0';

/**
 * What the model is told when it connects. Model-facing, like the tool
 * descriptions, so it lives next to them rather than in the product catalog.
 */
export const SERVER_INSTRUCTIONS = [
  'Post Array publishes to social accounts the person has connected, through official platform APIs, under the rules of their workspace.',
  'Start with list_accounts and list_projects: every draft belongs to a project, and draft_post needs a project_id from list_projects.',
  'Draft first, then validate_post or preview_post, then schedule_post. publish_post never publishes on the first call: it returns a confirmation link a person must approve in Post Array, then call it again with the confirmation_id.',
  'Every tool that changes something needs an idempotency_key. Reuse the same key when retrying the same action so it happens once.',
  'A refusal names the scope or approval level that is missing. Tell the person what it says rather than retrying.',
].join(' ');

export interface McpServerOptions {
  readonly registry: ToolRegistry;
  readonly dispatcher: Dispatcher;
  /** Resolved per request by the HTTP layer, which re-verifies every call. */
  readonly grantForRequest: () => VerifiedGrant;
  readonly sandbox: boolean;
}

interface ToolDeclaration {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: Record<string, unknown>;
  readonly annotations: {
    readonly title: string;
    readonly readOnlyHint: boolean;
    readonly destructiveHint: boolean;
    readonly idempotentHint: boolean;
    readonly openWorldHint: boolean;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Fill in `description` on every property that has none, recursing into arrays. */
function describeProperties(toolName: string, schema: Record<string, unknown>): void {
  const properties = schema['properties'];
  if (!isRecord(properties)) {
    return;
  }
  for (const [field, property] of Object.entries(properties)) {
    if (!isRecord(property)) {
      continue;
    }
    const description = describeField(toolName, field);
    if (property['description'] === undefined && description !== undefined) {
      property['description'] = description;
    }
    describeProperties(toolName, property);
    const items = property['items'];
    if (isRecord(items)) {
      describeProperties(toolName, items);
    }
  }
}

export function jsonSchemaOf(tool: ToolDefinition): Record<string, unknown> {
  // `z.toJSONSchema` already returns a plain JSON Schema object; spreading it
  // keeps the value structural without asserting a type onto it.
  const schema: Record<string, unknown> = {
    ...z.toJSONSchema(tool.inputSchema, { io: 'input', target: 'draft-2020-12' }),
  };
  describeProperties(tool.name, schema);
  return schema;
}

export function declareTool(tool: ToolDefinition, sandbox: boolean): ToolDeclaration {
  const description = sandbox
    ? `${describeTool(tool)} SANDBOX MODE: this server is wired to the fake provider, so nothing reaches a real platform.`
    : describeTool(tool);

  const title = toolTitle(tool.name);
  return {
    name: tool.name,
    title,
    description,
    inputSchema: jsonSchemaOf(tool),
    annotations: {
      title,
      readOnlyHint: tool.risk === 'read',
      // Cancelling removes something that was going to happen; publishing
      // creates something that cannot be recalled. Both are flagged.
      destructiveHint: tool.risk === 'consequential',
      // A read changes nothing, so repeating it is harmless. A write is
      // idempotent only because it demands an idempotency key.
      idempotentHint: tool.risk === 'read' || tool.requiresIdempotencyKey,
      // Reaching outside Post Array: a platform, or a URL someone supplied.
      openWorldHint: tool.risk === 'consequential' || tool.openWorld === true,
    },
  };
}

/**
 * The tool result an MCP client receives.
 *
 * Compact structured content. Never a dump: results carry ids a client can
 * pass to the next tool rather than whole resources. No `resource_link` items:
 * this server offers no `resources` capability, so a link a client cannot
 * resolve would only be noise.
 */
export function toCallToolResult(result: ToolResult): Record<string, unknown> {
  return {
    content: [{ type: 'text', text: JSON.stringify(result.data) }],
    structuredContent: result.data,
    isError: false,
  };
}

/** A refusal, with a plain sentence beside the stable code and message key. */
export function toCallToolError(problem: ProblemJson): Record<string, unknown> {
  const withMessage = { ...problem, message: problemMessage(problem) };
  return {
    content: [{ type: 'text', text: JSON.stringify(withMessage) }],
    structuredContent: withMessage,
    isError: true,
  };
}

export function createMcpServer(options: McpServerOptions): Server {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: { listChanged: false } }, instructions: SERVER_INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: options.registry.tools.map((tool) => declareTool(tool, options.sandbox)),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const outcome = await options.dispatcher.call({
      toolName: request.params.name,
      rawArguments: request.params.arguments ?? {},
      grant: options.grantForRequest(),
    });
    return outcome.ok ? toCallToolResult(outcome.result) : toCallToolError(outcome.problem);
  });

  return server;
}
