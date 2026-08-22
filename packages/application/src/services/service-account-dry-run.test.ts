import { describe, expect, it } from 'vitest';

import { DRY_RUN_TOOL_NAMES, rehearseToolCall } from './service-account-dry-run';
import type { DryRunIdentity } from './service-account-dry-run';

/**
 * The rehearsal has to refuse for the same reason the real call would, in the
 * same order, or the playground teaches an agent author something false.
 */

const READER: DryRunIdentity = {
  disabled: false,
  scopes: ['accounts:read', 'drafts:read'],
  approvalLevel: 'level_0_read',
  projectIds: [],
  connectionIds: [],
};

const SCHEDULER: DryRunIdentity = {
  disabled: false,
  scopes: ['accounts:read', 'drafts:read', 'drafts:write', 'posts:schedule'],
  approvalLevel: 'level_2_scheduled',
  projectIds: ['project_1'],
  connectionIds: ['conn_1'],
};

describe('rehearseToolCall', () => {
  it('permits a call the identity holds the scope and the level for', () => {
    const result = rehearseToolCall(READER, 'list_connections', {});
    expect(result.outcome).toBe('ok');
    expect(result.reason).toBeNull();
    // Permitted, and still nothing happened. Both halves matter.
    expect(result.body['executed']).toBe(false);
  });

  it('refuses an action whose scope was never granted', () => {
    const result = rehearseToolCall(READER, 'create_draft', { projectId: 'project_1' });
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.scope_missing');
    expect(result.body['missing_scopes']).toEqual(['drafts:write']);
  });

  it('refuses an action above the identity’s approval level even with the scope', () => {
    const overScoped: DryRunIdentity = {
      ...SCHEDULER,
      scopes: [...SCHEDULER.scopes, 'posts:publish'],
    };
    const result = rehearseToolCall(overScoped, 'publish_now', {});
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.approval_level_too_low');
    expect(result.body['required_approval_level']).toBe('level_3_confirm');
  });

  it('refuses a project the identity was not preauthorized for', () => {
    const result = rehearseToolCall(SCHEDULER, 'create_draft', { projectId: 'project_other' });
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.project_not_preauthorized');
  });

  it('refuses a connection the identity was not preauthorized for', () => {
    const result = rehearseToolCall(SCHEDULER, 'get_capabilities', { connectionId: 'conn_other' });
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.connection_not_preauthorized');
  });

  it('treats an empty narrowing as no narrowing, not as nothing allowed', () => {
    const result = rehearseToolCall(READER, 'get_capabilities', { connectionId: 'conn_any' });
    expect(result.outcome).toBe('ok');
  });

  it('refuses everything once the identity is stopped', () => {
    const result = rehearseToolCall({ ...SCHEDULER, disabled: true }, 'list_connections', {});
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.service_account_disabled');
  });

  it('refuses a tool it does not know rather than guessing at its risk', () => {
    const result = rehearseToolCall(SCHEDULER, 'publish_everywhere', {});
    expect(result.outcome).toBe('denied');
    expect(result.reason).toBe('agent_policy.unknown_tool');
  });

  it('names the tools the playground offers', () => {
    expect([...DRY_RUN_TOOL_NAMES].sort()).toEqual([
      'create_draft',
      'get_analytics',
      'get_capabilities',
      'list_connections',
      'publish_now',
      'schedule_post',
      'validate_content',
    ]);
  });
});
