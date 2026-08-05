import { beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';
import type { Scope } from '@relay/contracts';

import { createMemoryConfirmationStore } from './confirmations.js';
import type { ConfirmationStore } from './confirmations.js';
import { createDispatcher, createWorkspaceKillSwitch } from './dispatch.js';
import type { Dispatcher } from './dispatch.js';
import { createSandboxServices } from './sandbox.js';
import type { SandboxServices } from './sandbox.js';
import { createToolRegistry } from './tools/index.js';
import type { VerifiedGrant } from './auth/verifier.js';

const WORKSPACE = 'ws_sandbox';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

const ALL_GRANTED: readonly Scope[] = [
  'accounts:read',
  'drafts:read',
  'drafts:write',
  'posts:schedule',
  'posts:publish',
  'posts:cancel',
  'analytics:read',
  'growth:read',
  'growth:write',
];

function grantOf(overrides: Partial<VerifiedGrant> = {}): VerifiedGrant {
  return {
    active: true,
    subject: 'user_01',
    clientId: 'rly_pk_agent',
    grantId: 'grant_01',
    workspaceId: WORKSPACE,
    scopes: [...ALL_GRANTED],
    approvalLevel: 'level_3_confirm',
    audience: ['https://mcp.relay.example/mcp'],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
    ...overrides,
  };
}

interface Harness {
  readonly dispatcher: Dispatcher;
  readonly services: SandboxServices;
  readonly confirmations: ConfirmationStore;
  readonly killSwitch: ReturnType<typeof createWorkspaceKillSwitch>;
}

function harness(): Harness {
  const clock = { now: () => NOW };
  const services = createSandboxServices({ clock, workspaceId: WORKSPACE });
  const confirmations = createMemoryConfirmationStore({
    clock,
    confirmUrlTemplate: (id) => `https://app.relay.example/confirm/${id}`,
  });
  const killSwitch = createWorkspaceKillSwitch();
  const dispatcher = createDispatcher({
    registry: createToolRegistry(),
    services,
    auditSink: services.auditSink,
    confirmations,
    logger: createLogger({ service: 'mcp' }, { level: 'silent', pretty: false }),
    clock,
    killSwitch,
    sandbox: true,
  });
  return { dispatcher, services, confirmations, killSwitch };
}

let current: Harness;

beforeEach(() => {
  current = harness();
});

async function draft(targets = 2): Promise<string> {
  const outcome = await current.dispatcher.call({
    toolName: 'draft_post',
    grant: grantOf(),
    rawArguments: {
      brand_id: 'brand_sandbox',
      body: 'A sandbox post.',
      targets: Array.from({ length: targets }, (_, index) => ({
        connection_id: `conn_sandbox_${index + 1}`,
      })),
    },
  });
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    throw new Error('draft failed');
  }
  const data = outcome.result.data as { content_item_id: string };
  return data.content_item_id;
}

describe('scope enforcement', () => {
  it('refuses a tool whose scope was not granted', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf({ scopes: ['drafts:read'] }),
      rawArguments: {},
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.problem.code).toBe('SCOPE_INSUFFICIENT');
    expect(outcome.problem.detail?.['missingScopes']).toEqual(['accounts:read']);
  });

  it('does not let a write scope imply a read scope', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf({ scopes: ['drafts:write', 'posts:publish'] }),
      rawArguments: {},
    });
    expect(outcome.ok).toBe(false);
  });

  it('re-checks on every call rather than trusting the previous one', async () => {
    const first = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf(),
      rawArguments: {},
    });
    expect(first.ok).toBe(true);

    const second = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf({ killed: true }),
      rawArguments: {},
    });
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.problem.code).toBe('FORBIDDEN');
    }
  });
});

describe('approval level', () => {
  it('refuses scheduling for a draft-only grant', async () => {
    const contentItemId = await draft();
    const outcome = await current.dispatcher.call({
      toolName: 'schedule_post',
      grant: grantOf({ approvalLevel: 'level_1_draft' }),
      rawArguments: {
        content_item_id: contentItemId,
        instant: '2026-08-10T09:00:00.000Z',
        iana_time_zone: 'Europe/Berlin',
        idempotency_key: 'sched-0001',
      },
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('APPROVAL_REQUIRED');
    }
  });

  it('refuses immediate publication below level 3', async () => {
    const contentItemId = await draft();
    const outcome = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf({ approvalLevel: 'level_2_scheduled' }),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'pub-0001' },
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('APPROVAL_REQUIRED');
    }
  });

  it('allows a read tool at level 0', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf({ approvalLevel: 'level_0_read' }),
      rawArguments: {},
    });
    expect(outcome.ok).toBe(true);
  });
});

describe('idempotency', () => {
  it('refuses a consequential tool with no key', async () => {
    const contentItemId = await draft();
    const outcome = await current.dispatcher.call({
      toolName: 'schedule_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        instant: '2026-08-10T09:00:00.000Z',
        iana_time_zone: 'Europe/Berlin',
      },
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('VALIDATION_FAILED');
    }
    expect(current.services.state.jobCount).toBe(0);
  });

  it('accepts a well formed key', async () => {
    const contentItemId = await draft();
    const outcome = await current.dispatcher.call({
      toolName: 'schedule_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        instant: '2026-08-10T09:00:00.000Z',
        iana_time_zone: 'Europe/Berlin',
        idempotency_key: 'schedule-launch-001',
      },
    });
    expect(outcome.ok).toBe(true);
    expect(current.services.state.jobCount).toBe(1);
  });
});

describe('publish_post confirmation', () => {
  it('publishes nothing on the first call and returns a link', async () => {
    const contentItemId = await draft();
    const outcome = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    const data = outcome.result.data as { status: string; confirm_url: string };
    expect(data.status).toBe('confirmation_required');
    expect(data.confirm_url).toContain('https://app.relay.example/confirm/');
    expect(outcome.result.pendingConfirmation).toBeDefined();
    // Nothing reached the provider, not even in sandbox.
    expect(current.services.state.receiptCount).toBe(0);
  });

  it('refuses a confirmation id a person has not approved', async () => {
    const contentItemId = await draft();
    const first = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';

    const second = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: confirmationId,
        idempotency_key: 'publish-001',
      },
    });
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.problem.code).toBe('APPROVAL_REQUIRED');
      expect(second.problem.detail?.['reason']).toBe('CONFIRMATION_PENDING');
    }
    expect(current.services.state.receiptCount).toBe(0);
  });

  it('publishes and produces a receipt once a person has approved', async () => {
    const contentItemId = await draft();
    const first = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';
    await current.confirmations.approve({ confirmationId, approvedBy: 'user_owner' });

    const second = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: confirmationId,
        idempotency_key: 'publish-001',
      },
    });
    expect(second.ok).toBe(true);
    if (!second.ok) {
      return;
    }
    const data = second.result.data as { status: string; confirmed_by: string };
    expect(data.status).toBe('published');
    expect(data.confirmed_by).toBe('user_owner');
    expect(second.result.receiptIds?.length).toBe(1);
  });

  it('refuses to reuse a confirmation', async () => {
    const contentItemId = await draft();
    const first = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';
    await current.confirmations.approve({ confirmationId, approvedBy: 'user_owner' });

    const args = {
      content_item_id: contentItemId,
      confirmation_id: confirmationId,
      idempotency_key: 'publish-001',
    };
    const ok = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: args,
    });
    expect(ok.ok).toBe(true);

    const replay = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: args,
    });
    expect(replay.ok).toBe(false);
    if (!replay.ok) {
      expect(replay.problem.code).toBe('CONFLICT');
    }
  });

  it('refuses a confirmation belonging to a different grant', async () => {
    const contentItemId = await draft();
    const first = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';
    await current.confirmations.approve({ confirmationId, approvedBy: 'user_owner' });

    const other = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf({ grantId: 'grant_other' }),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: confirmationId,
        idempotency_key: 'publish-001',
      },
    });
    expect(other.ok).toBe(false);
    if (!other.ok) {
      expect(other.problem.code).toBe('FORBIDDEN');
    }
  });
});

describe('kill switches', () => {
  it('stops every tool for a disabled workspace', async () => {
    current.killSwitch.disable(WORKSPACE);
    const outcome = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf(),
      rawArguments: {},
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('POLICY_BLOCKED');
    }
  });
});

describe('audit', () => {
  it('records the app, the subject, the workspace, the scope and the receipt', async () => {
    const contentItemId = await draft();
    const first = await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';
    await current.confirmations.approve({ confirmationId, approvedBy: 'user_owner' });
    await current.dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: confirmationId,
        idempotency_key: 'publish-001',
      },
    });

    const published = current.services.auditLog.find(
      (entry) => entry.action === 'mcp.tool.publish_post' && entry.targetId !== null,
    );
    expect(published).toBeDefined();
    expect(published?.workspaceId).toBe(WORKSPACE);
    expect(published?.actorId).toBe('user_01');
    expect(published?.outcome).toBe('allowed');
    expect(published?.metadata['clientId']).toBe('rly_pk_agent');
    expect(published?.metadata['grantId']).toBe('grant_01');
    expect(published?.metadata['scopesUsed']).toEqual(['posts:publish']);
    expect(published?.targetType).toBe('publication_receipt');
  });

  it('records a denial too', async () => {
    await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf({ scopes: [] }),
      rawArguments: {},
    });
    const denied = current.services.auditLog.find((entry) => entry.outcome === 'denied');
    expect(denied).toBeDefined();
    expect(denied?.metadata['errorCode']).toBe('SCOPE_INSUFFICIENT');
  });
});

describe('unknown tools and bad input', () => {
  it('refuses a tool that does not exist', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'publish_everywhere',
      grant: grantOf(),
      rawArguments: {},
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('NOT_FOUND');
    }
  });

  it('refuses arguments that do not parse', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'get_capabilities',
      grant: grantOf(),
      rawArguments: { connection_id: 42 },
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.problem.code).toBe('VALIDATION_FAILED');
    }
  });
});

describe('compact results', () => {
  it('bounds a page and returns links instead of dumping', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'list_accounts',
      grant: grantOf(),
      rawArguments: { limit: 1 },
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    const data = outcome.result.data as { accounts: unknown[]; has_more: boolean };
    expect(data.accounts).toHaveLength(1);
    expect(data.has_more).toBe(true);
    expect(outcome.result.resourceLinks.length).toBeGreaterThan(0);
  });

  it('reports an unreadable metric as unavailable rather than zero', async () => {
    const outcome = await current.dispatcher.call({
      toolName: 'get_analytics',
      grant: grantOf(),
      rawArguments: { receipt_id: 'receipt_x' },
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    const data = outcome.result.data as {
      metrics: { metric: string; value: number | null; availability: string }[];
    };
    const shares = data.metrics.find((metric) => metric.metric === 'shares');
    expect(shares?.value).toBeNull();
    expect(shares?.availability).toBe('unavailable_permission');
  });
});
