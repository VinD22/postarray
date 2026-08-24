import { beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';
import type { Scope } from '@relay/contracts';

import { createMemoryConfirmationStore } from './confirmations';
import type { ConfirmationStore } from './confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from './dispatch';
import type { DispatchOutcome, Dispatcher } from './dispatch';
import { createSandboxServices } from './sandbox';
import type { SandboxServices } from './sandbox';
import { createToolRegistry } from './tools/index';
import type { ToolRegistry } from './tools/index';
import type { VerifiedGrant } from './auth/verifier';

/**
 * One external agent, one workspace, from connection to publication.
 *
 * The unit tests around this file each prove one gate. This one proves the
 * sequence a real client actually walks: discover the catalog, draft, ask to
 * publish, be told a person must confirm, and only then publish. What it is
 * really asserting is the negative — that at the moment the agent asked to
 * publish, nothing had been written. An agent that could publish by asking
 * twice, or by ignoring the confirmation id, would still pass every gate test
 * individually and fail here.
 *
 * It runs against the sandbox services, so no provider is contacted and no
 * database is touched. The confirmation is approved through
 * `confirmations.approve`, which is the app's entry point and is deliberately
 * not reachable from any tool: the agent cannot confirm itself.
 */

const WORKSPACE = 'ws_sandbox';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

const AGENT_SCOPES: readonly Scope[] = [
  'accounts:read',
  'drafts:read',
  'drafts:write',
  'posts:publish',
  'analytics:read',
];

function grantOf(overrides: Partial<VerifiedGrant> = {}): VerifiedGrant {
  return {
    active: true,
    subject: 'user_01',
    clientId: 'rly_pk_agent',
    grantId: 'grant_01',
    workspaceId: WORKSPACE,
    scopes: [...AGENT_SCOPES],
    approvalLevel: 'level_3_confirm',
    audience: ['https://mcp.relay.example/mcp'],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
    ...overrides,
  };
}

interface Client {
  readonly dispatcher: Dispatcher;
  readonly registry: ToolRegistry;
  readonly services: SandboxServices;
  readonly confirmations: ConfirmationStore;
}

/** A scripted MCP client: it can list the catalog and call a tool, nothing else. */
function connect(): Client {
  const clock = { now: () => NOW };
  const services = createSandboxServices({ clock, workspaceId: WORKSPACE });
  const confirmations = createMemoryConfirmationStore({
    clock,
    confirmUrlTemplate: (id) => `https://app.relay.example/confirm/${id}`,
  });
  const registry = createToolRegistry();
  const dispatcher = createDispatcher({
    registry,
    services,
    auditSink: services.auditSink,
    confirmations,
    logger: createLogger({ service: 'mcp' }, { level: 'silent', pretty: false }),
    clock,
    killSwitch: createWorkspaceKillSwitch(),
    sandbox: true,
  });
  return { dispatcher, registry, services, confirmations };
}

let client: Client;

beforeEach(() => {
  client = connect();
});

function dataOf(outcome: DispatchOutcome): Record<string, unknown> {
  if (!outcome.ok) {
    throw new Error(`tool call refused: ${outcome.problem.title}`);
  }
  return outcome.result.data as Record<string, unknown>;
}

describe('an external MCP client, end to end', () => {
  it('lists a catalog whose every consequential tool announces its own gate', () => {
    const consequential = client.registry.tools.filter((tool) => tool.risk === 'consequential');

    expect(client.registry.names).toContain('draft_post');
    expect(client.registry.names).toContain('publish_post');
    expect(consequential.length).toBeGreaterThan(0);
    for (const tool of consequential) {
      // A client reading the catalog can see the cost before paying it.
      expect(tool.requiresIdempotencyKey).toBe(true);
      expect(tool.sideEffects.length).toBeGreaterThan(10);
    }
  });

  it('drafts, is refused a publish until a person confirms, and writes nothing before that', async () => {
    const drafted = dataOf(
      await client.dispatcher.call({
        toolName: 'draft_post',
        grant: grantOf(),
        rawArguments: {
          project_id: 'project_sandbox',
          body: 'A post the agent wrote.',
          targets: [{ connection_id: 'conn_sandbox_1' }],
        },
      }),
    );
    const contentItemId = drafted['content_item_id'] as string;
    expect(contentItemId).toBeTruthy();
    // A draft is not a publication.
    expect(client.services.state.jobCount).toBe(0);
    expect(client.services.state.receiptCount).toBe(0);

    const asked = dataOf(
      await client.dispatcher.call({
        toolName: 'publish_post',
        grant: grantOf(),
        rawArguments: { content_item_id: contentItemId, idempotency_key: 'idem_journey_1' },
      }),
    );

    expect(asked['status']).toBe('confirmation_required');
    expect(asked['confirm_url']).toMatch(/^https:\/\/app\.relay\.example\/confirm\//u);
    // The whole point: asking to publish published nothing.
    expect(client.services.state.jobCount).toBe(0);
    expect(client.services.state.receiptCount).toBe(0);

    // Asking again does not wear the gate down.
    const askedAgain = dataOf(
      await client.dispatcher.call({
        toolName: 'publish_post',
        grant: grantOf(),
        rawArguments: { content_item_id: contentItemId, idempotency_key: 'idem_journey_2' },
      }),
    );
    expect(askedAgain['status']).toBe('confirmation_required');
    expect(client.services.state.receiptCount).toBe(0);

    const confirmationId = asked['confirmation_id'] as string;
    // Approval happens in Post Array, by a person. No tool can reach this call.
    await client.confirmations.approve({ confirmationId, approvedBy: 'user_01' });

    const published = dataOf(
      await client.dispatcher.call({
        toolName: 'publish_post',
        grant: grantOf(),
        rawArguments: {
          content_item_id: contentItemId,
          confirmation_id: confirmationId,
          idempotency_key: 'idem_journey_1',
        },
      }),
    );

    expect(published['status']).toBe('published');
    expect(published['confirmed_by']).toBe('user_01');
    expect(client.services.state.receiptCount).toBe(1);
  });

  it('refuses a publish outright when the agent was never granted the scope', async () => {
    const outcome = await client.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf({ scopes: ['drafts:read', 'drafts:write'] }),
      rawArguments: { content_item_id: 'content_anything', idempotency_key: 'idem_journey_3' },
    });

    expect(outcome.ok).toBe(false);
    expect(client.services.state.receiptCount).toBe(0);
  });

  it('recovers the receipt afterwards, so a client that lost the reply never republishes', async () => {
    const drafted = dataOf(
      await client.dispatcher.call({
        toolName: 'draft_post',
        grant: grantOf(),
        rawArguments: {
          project_id: 'project_sandbox',
          body: 'A post the agent wrote.',
          targets: [{ connection_id: 'conn_sandbox_1' }],
        },
      }),
    );
    const contentItemId = drafted['content_item_id'] as string;
    const asked = dataOf(
      await client.dispatcher.call({
        toolName: 'publish_post',
        grant: grantOf(),
        rawArguments: { content_item_id: contentItemId, idempotency_key: 'idem_journey_4' },
      }),
    );
    await client.confirmations.approve({
      confirmationId: asked['confirmation_id'] as string,
      approvedBy: 'user_01',
    });
    await client.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: asked['confirmation_id'] as string,
        idempotency_key: 'idem_journey_4',
      },
    });

    const recent = dataOf(
      await client.dispatcher.call({
        toolName: 'list_recent_receipts',
        grant: grantOf(),
        rawArguments: { limit: 5 },
      }),
    );
    const receipts = recent['receipts'] as readonly Record<string, unknown>[];
    expect(receipts.length).toBe(1);

    const receipt = dataOf(
      await client.dispatcher.call({
        toolName: 'get_receipt',
        grant: grantOf(),
        rawArguments: { receipt_id: receipts[0]?.['receipt_id'] },
      }),
    );
    expect(receipt['external_post_id']).toBeTruthy();
  });
});
