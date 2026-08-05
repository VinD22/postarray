import { z } from 'zod';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

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

export const SERVER_NAME = 'relay';
export const SERVER_VERSION = '0.1.0';

export interface McpServerOptions {
  readonly registry: ToolRegistry;
  readonly dispatcher: Dispatcher;
  /** Resolved per request by the HTTP layer, which re-verifies every call. */
  readonly grantForRequest: () => VerifiedGrant;
  readonly sandbox: boolean;
}

interface ToolDeclaration {
  readonly name: string;
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

function jsonSchemaOf(tool: ToolDefinition): Record<string, unknown> {
  // `z.toJSONSchema` already returns a plain JSON Schema object; spreading it
  // keeps the value structural without asserting a type onto it.
  return { ...z.toJSONSchema(tool.inputSchema, { io: 'input', target: 'draft-2020-12' }) };
}

export function declareTool(tool: ToolDefinition, sandbox: boolean): ToolDeclaration {
  const description = sandbox
    ? `${describeTool(tool)} SANDBOX MODE: this server is wired to the fake provider, so nothing reaches a real platform.`
    : describeTool(tool);

  return {
    name: tool.name,
    description,
    inputSchema: jsonSchemaOf(tool),
    annotations: {
      title: tool.name,
      readOnlyHint: tool.risk === 'read',
      // Cancelling removes something that was going to happen; publishing
      // creates something that cannot be recalled. Both are flagged.
      destructiveHint: tool.risk === 'consequential',
      idempotentHint: tool.requiresIdempotencyKey,
      openWorldHint: tool.risk === 'consequential',
    },
  };
}

/**
 * The tool result an MCP client receives.
 *
 * Compact structured content plus resource links. Never a dump: a client that
 * wants the whole calendar follows a link, it does not receive it by accident.
 */
export function toCallToolResult(result: ToolResult): Record<string, unknown> {
  return {
    content: [
      { type: 'text', text: JSON.stringify(result.data) },
      ...result.resourceLinks.map((link) => ({
        type: 'resource_link',
        uri: link.uri,
        name: link.name,
        description: link.description,
      })),
    ],
    structuredContent: result.data,
    isError: false,
  };
}

export function toCallToolError(problem: unknown): Record<string, unknown> {
  return {
    content: [{ type: 'text', text: JSON.stringify(problem) }],
    structuredContent: problem,
    isError: true,
  };
}

export function createMcpServer(options: McpServerOptions): Server {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: { listChanged: false } } },
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
