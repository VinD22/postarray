import { beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';

import type { VerifiedGrant } from '../auth/verifier';
import { createMemoryConfirmationStore } from '../confirmations';
import type { ConfirmationStore } from '../confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from '../dispatch';
import type { Dispatcher } from '../dispatch';
import type { PublishConfirmationEvidenceLike } from '../ports';
import { createSandboxServices } from '../sandbox';
import type { SandboxServices } from '../sandbox';
import { createToolRegistry } from './index';

/**
 * `preview_commit` and the escalations `publish_post` acknowledges.
 *
 * `publish_post` used to acknowledge a hard-coded `immediate_publish`, which
 * the server refuses whenever a target is also being used for the first time.
 * It now acknowledges exactly what the server's own preflight reported.
 */

const WORKSPACE = 'ws_sandbox';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

function grant(): VerifiedGrant {
  return {
    active: true,
    subject: 'user_01',
    clientId: 'rly_pk_agent',
    grantId: 'grant_01',
    workspaceId: WORKSPACE,
    scopes: ['accounts:read', 'drafts:read', 'drafts:write', 'posts:schedule', 'posts:publish'],
    approvalLevel: 'level_3_confirm',
    audience: ['https://mcp.relay.example/mcp'],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
  };
}

let dispatcher: Dispatcher;
let services: SandboxServices;
let confirmations: ConfirmationStore;

beforeEach(() => {
  const clock = { now: () => NOW };
  services = createSandboxServices({ clock, workspaceId: WORKSPACE });
  confirmations = createMemoryConfirmationStore({
    clock,
    confirmUrlTemplate: (id) => `https://app.relay.example/confirm/${id}`,
  });
  dispatcher = createDispatcher({
    registry: createToolRegistry(),
    services,
    auditSink: services.auditSink,
    confirmations,
    logger: createLogger({ service: 'mcp' }, { level: 'silent', pretty: false }),
    clock,
    killSwitch: createWorkspaceKillSwitch(),
    sandbox: true,
  });
});

async function draft(): Promise<string> {
  const outcome = await dispatcher.call({
    toolName: 'draft_post',
    grant: grant(),
    rawArguments: {
      project_id: 'project_sandbox',
      body: 'A sandbox post.',
      targets: [{ connection_id: 'conn_sandbox_1' }, { connection_id: 'conn_sandbox_2' }],
    },
  });
  if (!outcome.ok) {
    throw new Error('draft failed');
  }
  return (outcome.result.data as { content_item_id: string }).content_item_id;
}

describe('preview_commit', () => {
  it('reports the targets and the escalations without committing anything', async () => {
    const contentItemId = await draft();
    const outcome = await dispatcher.call({
      toolName: 'preview_commit',
      grant: grant(),
      rawArguments: {
        content_item_id: contentItemId,
        kind: 'publish_now',
        connection_ids: ['conn_sandbox_1'],
      },
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    const data = outcome.result.data as {
      target_count: number;
      escalations: { code: string }[];
      can_commit: boolean;
    };
    expect(data.target_count).toBe(1);
    expect(data.can_commit).toBe(true);
    expect(data.escalations.map((entry) => entry.code)).toEqual(['immediate_publish']);
    expect(services.state.receiptCount).toBe(0);
  });
});

describe('publish_post escalations', () => {
  it('acknowledges first_use_connection as well as immediate_publish when the preflight names both', async () => {
    const contentItemId = await draft();
    const original = services.publishing.previewCommit.bind(services.publishing);
    services.publishing.previewCommit = async (ctx, input) => {
      const preview = await original(ctx, input);
      return {
        ...preview,
        escalations: [
          ...preview.escalations,
          {
            code: 'first_use_connection',
            messageKey: 'agent_policy.first_use_connection',
            params: { connectionId: 'conn_sandbox_2' },
            connectionId: 'conn_sandbox_2',
          },
        ],
      };
    };
    const seen: PublishConfirmationEvidenceLike[] = [];
    const publishNow = services.publishing.publishNow.bind(services.publishing);
    services.publishing.publishNow = async (ctx, input) => {
      seen.push(input.confirmation);
      return publishNow(ctx, input);
    };

    const first = await dispatcher.call({
      toolName: 'publish_post',
      grant: grant(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    if (!first.ok) {
      throw new Error('expected a ticket');
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId ?? '';
    await confirmations.approve({ confirmationId, approvedBy: 'user_owner' });

    const second = await dispatcher.call({
      toolName: 'publish_post',
      grant: grant(),
      rawArguments: {
        content_item_id: contentItemId,
        confirmation_id: confirmationId,
        idempotency_key: 'publish-001',
      },
    });
    expect(second.ok).toBe(true);
    expect([...(seen[0]?.acknowledgedEscalations ?? [])].sort()).toEqual([
      'first_use_connection',
      'immediate_publish',
    ]);
  });
});
