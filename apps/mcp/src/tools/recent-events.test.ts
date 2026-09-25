import { beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';
import type { RealtimeEvent, Scope } from '@relay/contracts';

import { createMemoryConfirmationStore } from '../confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from '../dispatch';
import type { Dispatcher } from '../dispatch';
import { createSandboxServices } from '../sandbox';
import { createToolRegistry } from './index';
import type { RelayServicePort } from '../ports';
import type { VerifiedGrant } from '../auth/verifier';

/**
 * `list_recent_events`.
 *
 * A tool call answers and ends, so an agent cannot hold the stream open the way
 * a browser tab does. This is the poll that stands in for it, and the two
 * things worth proving are that it reads the workspace on the verified grant
 * rather than anything in the arguments, and that it declares the read scope it
 * needs.
 */

const WORKSPACE = 'ws_sandbox';
const OTHER_WORKSPACE = 'ws_01j0000000000000000000000b';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

function grantOf(overrides: Partial<VerifiedGrant> = {}): VerifiedGrant {
  return {
    active: true,
    subject: 'user_01',
    clientId: 'rly_pk_agent',
    grantId: 'grant_01',
    workspaceId: WORKSPACE,
    scopes: ['accounts:read'] as Scope[],
    approvalLevel: 'level_0_read',
    audience: ['https://mcp.relay.example/mcp'],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
    ...overrides,
  };
}

function event(id: string, workspaceId = WORKSPACE): RealtimeEvent {
  return {
    id,
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-08-04T11:59:00.000Z',
    data: {
      type: 'post.status',
      publishJobId: 'job_01j0000000000000000000000a',
      contentItemId: null,
      state: 'published',
    },
  };
}

let dispatcher: Dispatcher;
let listRecentCalls: { workspaceId: string; since: string | undefined; limit: number }[];

function buildDispatcher(events: readonly RealtimeEvent[]): void {
  const clock = { now: () => NOW };
  const sandbox = createSandboxServices({ clock, workspaceId: WORKSPACE });
  const services: RelayServicePort = {
    ...sandbox,
    events: {
      listRecent: (ctx, input) => {
        listRecentCalls.push({
          workspaceId: ctx.workspaceId,
          since: input.since,
          limit: input.limit,
        });
        const visible = events.filter((one) => one.workspaceId === ctx.workspaceId);
        return Promise.resolve({
          events: visible,
          lastEventId: visible[visible.length - 1]?.id ?? null,
        });
      },
    },
  };

  dispatcher = createDispatcher({
    registry: createToolRegistry(),
    services,
    auditSink: sandbox.auditSink,
    confirmations: createMemoryConfirmationStore({
      clock,
      confirmUrlTemplate: (id) => `https://app.relay.example/confirm/${id}`,
    }),
    logger: createLogger({ service: 'mcp' }, { level: 'silent', pretty: false }),
    clock,
    killSwitch: createWorkspaceKillSwitch(),
    sandbox: true,
  });
}

beforeEach(() => {
  listRecentCalls = [];
});

async function call(
  rawArguments: Record<string, unknown>,
  grant: VerifiedGrant = grantOf(),
): Promise<Record<string, unknown>> {
  const outcome = await dispatcher.call({ toolName: 'list_recent_events', grant, rawArguments });
  expect(outcome.ok, JSON.stringify(outcome.ok ? {} : outcome.problem)).toBe(true);
  if (!outcome.ok) {
    throw new Error('call failed');
  }
  return outcome.result.data as Record<string, unknown>;
}

describe('list_recent_events', () => {
  it('returns the events and the id to resume from next turn', async () => {
    buildDispatcher([event('1725357600000-1'), event('1725357600000-2')]);

    const data = await call({});

    expect(data['returned']).toBe(2);
    expect(data['next_since']).toBe('1725357600000-2');
  });

  it('reads the workspace on the grant, never one in the arguments', async () => {
    buildDispatcher([event('1725357600000-1', OTHER_WORKSPACE)]);

    const data = await call({ workspace_id: OTHER_WORKSPACE });

    expect(listRecentCalls[0]?.workspaceId).toBe(WORKSPACE);
    expect(data['returned']).toBe(0);
  });

  it('passes the resume point through so a second turn sees no duplicate', async () => {
    buildDispatcher([]);
    await call({ since: '1725357600000-4' });

    expect(listRecentCalls[0]?.since).toBe('1725357600000-4');
  });

  it('bounds a page, so a long-running workspace cannot fill an agent context', async () => {
    buildDispatcher([]);
    const outcome = await dispatcher.call({
      toolName: 'list_recent_events',
      grant: grantOf(),
      rawArguments: { limit: 5000 },
    });

    expect(outcome.ok).toBe(false);
  });

  it('refuses a grant without the read scope it declares', async () => {
    buildDispatcher([]);
    const outcome = await dispatcher.call({
      toolName: 'list_recent_events',
      grant: grantOf({ scopes: [] }),
      rawArguments: {},
    });

    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.problem.code).toBe('SCOPE_INSUFFICIENT');
  });
});
