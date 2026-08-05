import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { ALL_TOOLS, TOOL_NAMES, createToolRegistry, describeTool } from './index';
import { SKILLS } from '../skills';

/**
 * The tool set is a product decision, so it is asserted rather than assumed. A
 * tool added without a risk, a scope and an approval level fails here, and so
 * does one whose description disagrees with what it enforces.
 */

const EXPECTED_READ = [
  'list_accounts',
  'get_capabilities',
  'get_calendar',
  'preview_post',
  'validate_post',
  'get_post_status',
  'get_analytics',
  'get_growth_plan',
  'list_growth_opportunities',
];

const EXPECTED_REVERSIBLE = [
  'draft_post',
  'request_approval',
  'generate_growth_plan',
  'create_campaign_from_plan',
];

const EXPECTED_CONSEQUENTIAL = ['schedule_post', 'publish_post', 'cancel_post'];

describe('the tool set', () => {
  it('is exactly the agreed list', () => {
    expect([...TOOL_NAMES].sort()).toEqual(
      [...EXPECTED_READ, ...EXPECTED_REVERSIBLE, ...EXPECTED_CONSEQUENTIAL].sort(),
    );
  });

  it('has no vague catch-all tool', () => {
    for (const name of TOOL_NAMES) {
      expect(name).not.toContain('everywhere');
      expect(name).not.toBe('publish');
      expect(name).not.toBe('post');
      expect(name).not.toContain('all_accounts');
    }
  });

  it('assigns the declared risk level to each tool', () => {
    const risk = new Map(ALL_TOOLS.map((tool) => [tool.name, tool.risk] as const));
    for (const name of EXPECTED_READ) {
      expect(risk.get(name), name).toBe('read');
    }
    for (const name of EXPECTED_REVERSIBLE) {
      expect(risk.get(name), name).toBe('reversible');
    }
    for (const name of EXPECTED_CONSEQUENTIAL) {
      expect(risk.get(name), name).toBe('consequential');
    }
  });

  it('rejects a duplicate name at construction', () => {
    const first = ALL_TOOLS[0];
    expect(first).toBeDefined();
    if (first === undefined) {
      return;
    }
    expect(() => createToolRegistry([first, first])).toThrow('DUPLICATE_TOOL_NAME');
  });
});

describe('tool invariants', () => {
  it('never lets a read tool declare a side effect', () => {
    for (const tool of ALL_TOOLS) {
      if (tool.risk === 'read') {
        expect(tool.sideEffects, tool.name).toBe('none');
        expect(tool.requiresIdempotencyKey, tool.name).toBe(false);
        expect(tool.requiresHumanConfirmation, tool.name).toBe(false);
        expect(tool.approvalLevel, tool.name).toBe('level_0_read');
      }
    }
  });

  it('requires an idempotency key for every consequential tool', () => {
    for (const tool of ALL_TOOLS) {
      if (tool.risk === 'consequential') {
        expect(tool.requiresIdempotencyKey, tool.name).toBe(true);
      }
    }
  });

  it('exposes idempotency_key in the schema of every tool that requires one', () => {
    for (const tool of ALL_TOOLS) {
      if (!tool.requiresIdempotencyKey) {
        continue;
      }
      const missingKey = tool.inputSchema.safeParse({});
      expect(missingKey.success, tool.name).toBe(false);
    }
  });

  it('requires human confirmation for immediate publication and nothing else', () => {
    const confirming = ALL_TOOLS.filter((tool) => tool.requiresHumanConfirmation).map(
      (tool) => tool.name,
    );
    expect(confirming).toEqual(['publish_post']);
  });

  it('requires the highest approval level only for immediate publication', () => {
    const highest = ALL_TOOLS.filter((tool) => tool.approvalLevel === 'level_3_confirm').map(
      (tool) => tool.name,
    );
    expect(highest).toEqual(['publish_post']);
  });

  it('asks for at least one scope everywhere', () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.scopes.length, tool.name).toBeGreaterThan(0);
    }
  });

  it('never asks a read tool for a write or consequential scope', () => {
    const writeScopes = new Set([
      'drafts:write',
      'accounts:write',
      'media:write',
      'rules:write',
      'growth:write',
      'posts:schedule',
      'posts:publish',
      'posts:cancel',
      'connections:admin',
    ]);
    for (const tool of ALL_TOOLS) {
      if (tool.risk !== 'read') {
        continue;
      }
      for (const scope of tool.scopes) {
        expect(writeScopes.has(scope), `${tool.name} asks for ${scope}`).toBe(false);
      }
    }
  });
});

describe('describeTool', () => {
  it('states the side effect, the scope and the approval level', () => {
    for (const tool of ALL_TOOLS) {
      const description = describeTool(tool);
      expect(description, tool.name).toContain('Risk:');
      expect(description, tool.name).toContain('Side effects:');
      expect(description, tool.name).toContain('Scopes:');
      expect(description, tool.name).toContain('Approval:');
      for (const scope of tool.scopes) {
        expect(description, tool.name).toContain(scope);
      }
    }
  });

  it('says an idempotency key is required when it is', () => {
    for (const tool of ALL_TOOLS) {
      if (tool.requiresIdempotencyKey) {
        expect(describeTool(tool), tool.name).toContain('idempotency_key');
      }
    }
  });

  it('says a person must confirm when one must', () => {
    for (const tool of ALL_TOOLS) {
      if (tool.requiresHumanConfirmation) {
        expect(describeTool(tool), tool.name).toContain('confirmation_id');
      }
    }
  });
});

describe('skills', () => {
  it('covers every host and names every tool that exists', () => {
    expect(SKILLS.map((skill) => skill.host).sort()).toEqual(['claude-code', 'codex', 'hermes']);
    for (const skill of SKILLS) {
      for (const name of TOOL_NAMES) {
        expect(skill.body, `${skill.host} omits ${name}`).toContain(name);
      }
    }
  });

  it('contains no secret and no workaround', () => {
    const forbidden = [
      'client_secret',
      'api_key',
      'apikey',
      'bearer ey',
      'rly_cs_',
      'rly_ak_',
      'cookie',
      'session token',
      'password',
      'private key',
    ];
    for (const skill of SKILLS) {
      const lowered = skill.body.toLowerCase();
      for (const term of forbidden) {
        expect(lowered, `${skill.host} mentions ${term}`).not.toContain(term);
      }
    }
  });

  it('tells the agent to stop on a refusal rather than route around it', () => {
    for (const skill of SKILLS) {
      expect(skill.body, skill.host).toContain('A refusal is an answer');
      expect(skill.body, skill.host).toContain('confirmation_id');
    }
  });

  it('matches the checked-in skill files', async () => {
    const root = fileURLToPath(new URL('../../skills/', import.meta.url));
    for (const skill of SKILLS) {
      const checkedIn = await readFile(`${root}${skill.path}`, 'utf8');
      // The files carry their own host-specific preamble; the rules must match.
      expect(checkedIn, skill.path).toContain('A refusal is an answer');
      expect(checkedIn, skill.path).toContain('Idempotency keys are not optional');
      expect(checkedIn, skill.path).toContain('A missing metric is not zero');
    }
  });
});
