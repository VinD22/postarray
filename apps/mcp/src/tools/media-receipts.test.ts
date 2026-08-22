import { beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';
import type { Scope } from '@relay/contracts';

import { createMemoryConfirmationStore } from '../confirmations';
import type { ConfirmationStore } from '../confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from '../dispatch';
import type { Dispatcher } from '../dispatch';
import { createSandboxServices } from '../sandbox';
import { createToolRegistry } from './index';
import type { VerifiedGrant } from '../auth/verifier';

/**
 * The media ingestion and receipt recovery tools.
 *
 * Each one is exercised twice: once with the scope it declares, and once
 * without it. The second case is the one that matters, because a tool that
 * works is easy and a tool that refuses correctly is the product.
 */

const WORKSPACE = 'ws_sandbox';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

const GRANTED: readonly Scope[] = [
  'accounts:read',
  'drafts:read',
  'drafts:write',
  'posts:schedule',
  'posts:publish',
  'analytics:read',
  'media:read',
  'media:write',
];

function grantOf(overrides: Partial<VerifiedGrant> = {}): VerifiedGrant {
  return {
    active: true,
    subject: 'user_01',
    clientId: 'rly_pk_agent',
    grantId: 'grant_01',
    workspaceId: WORKSPACE,
    scopes: [...GRANTED],
    approvalLevel: 'level_3_confirm',
    audience: ['https://mcp.relay.example/mcp'],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
    ...overrides,
  };
}

let dispatcher: Dispatcher;
let confirmations: ConfirmationStore;

beforeEach(() => {
  const clock = { now: () => NOW };
  const services = createSandboxServices({ clock, workspaceId: WORKSPACE });
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

async function callOk(
  toolName: string,
  rawArguments: Record<string, unknown>,
  grant: VerifiedGrant = grantOf(),
): Promise<Record<string, unknown>> {
  const outcome = await dispatcher.call({ toolName, grant, rawArguments });
  expect(outcome.ok, JSON.stringify(outcome.ok ? {} : outcome.problem)).toBe(true);
  if (!outcome.ok) {
    throw new Error('call failed');
  }
  return outcome.result.data as Record<string, unknown>;
}

async function expectScopeRefusal(
  toolName: string,
  rawArguments: Record<string, unknown>,
  scopes: readonly Scope[],
): Promise<void> {
  const outcome = await dispatcher.call({
    toolName,
    grant: grantOf({ scopes: [...scopes] }),
    rawArguments,
  });
  expect(outcome.ok).toBe(false);
  if (outcome.ok) {
    return;
  }
  expect(outcome.problem.code).toBe('SCOPE_INSUFFICIENT');
}

async function importOne(): Promise<string> {
  const data = await callOk('import_media', {
    url: 'https://example.invalid/press-kit/logo.png',
    idempotency_key: 'import-logo-001',
  });
  return data['media_id'] as string;
}

describe('import_media', () => {
  it('imports a URL the person supplied and points at the stored asset', async () => {
    const data = await callOk('import_media', {
      url: 'https://example.invalid/press-kit/logo.png',
      idempotency_key: 'import-logo-001',
    });
    expect(data['status']).toBe('succeeded');
    expect(data['resource_type']).toBe('media_asset');
    expect(typeof data['media_id']).toBe('string');
    expect(data['next_step']).toBe('get_media');
  });

  it('refuses without media:write, and media:read does not imply it', async () => {
    await expectScopeRefusal(
      'import_media',
      { url: 'https://example.invalid/logo.png', idempotency_key: 'import-logo-002' },
      ['media:read'],
    );
  });

  it('will not run without an idempotency key', async () => {
    const outcome = await dispatcher.call({
      toolName: 'import_media',
      grant: grantOf(),
      rawArguments: { url: 'https://example.invalid/logo.png' },
    });
    expect(outcome.ok).toBe(false);
  });
});

describe('get_media and list_media', () => {
  it('reads back the imported asset with its origin and scan state', async () => {
    const mediaId = await importOne();
    const data = await callOk('get_media', { media_id: mediaId });
    expect(data['media_id']).toBe(mediaId);
    expect(data['origin_kind']).toBe('url_import');
    expect(data['origin_url']).toBe('https://example.invalid/press-kit/logo.png');
    expect(data['scan_state']).toBe('clean');
    // A dimension we do not know is null, never 0.
    expect(data['duration_ms']).toBeNull();
  });

  it('lists a bounded page of assets', async () => {
    await importOne();
    const data = await callOk('list_media', { limit: 5 });
    expect(Array.isArray(data['media'])).toBe(true);
    expect((data['media'] as unknown[]).length).toBe(1);
    expect(data['has_more']).toBe(false);
  });

  it('refuses both reads without media:read', async () => {
    await expectScopeRefusal('get_media', { media_id: 'media_missing' }, ['drafts:read']);
    await expectScopeRefusal('list_media', {}, ['drafts:read']);
  });
});

describe('receipt recovery', () => {
  async function publishOnce(): Promise<void> {
    const draft = await callOk('draft_post', {
      project_id: 'project_sandbox',
      body: 'A sandbox post.',
      targets: [{ connection_id: 'conn_sandbox_1' }],
    });
    const contentItemId = draft['content_item_id'] as string;
    const first = await dispatcher.call({
      toolName: 'publish_post',
      grant: grantOf(),
      rawArguments: { content_item_id: contentItemId, idempotency_key: 'publish-001' },
    });
    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }
    const confirmationId = first.result.pendingConfirmation?.confirmationId;
    expect(confirmationId).toBeDefined();
    if (confirmationId === undefined) {
      return;
    }
    await confirmations.approve({ confirmationId, approvedBy: 'user_owner' });
    await callOk('publish_post', {
      content_item_id: contentItemId,
      idempotency_key: 'publish-001',
      confirmation_id: confirmationId,
    });
  }

  it('finds the receipt of a publication whose job id was lost', async () => {
    await publishOnce();
    const listed = await callOk('list_recent_receipts', { limit: 5 });
    const rows = listed['receipts'] as { receipt_id: string }[];
    expect(rows.length).toBe(1);
    expect(listed['next_step']).toBe('get_receipt');

    const first = rows[0];
    expect(first).toBeDefined();
    if (first === undefined) {
      return;
    }
    const receipt = await callOk('get_receipt', { receipt_id: first.receipt_id });
    expect(receipt['receipt_id']).toBe(first.receipt_id);
    expect(typeof receipt['external_post_id']).toBe('string');
    expect(typeof receipt['content_version_checksum']).toBe('string');
  });

  it('refuses both without analytics:read', async () => {
    await expectScopeRefusal('list_recent_receipts', {}, ['drafts:read']);
    await expectScopeRefusal('get_receipt', { receipt_id: 'receipt_x' }, ['drafts:read']);
  });
});
