import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import { SERVER_INSTRUCTIONS, declareTool, toCallToolError, toCallToolResult } from './server';
import { ALL_TOOLS } from './tools/index';

/**
 * What an MCP client actually sees in `tools/list` and `tools/call`.
 */

function propertiesOf(schema: Record<string, unknown>): [string, Record<string, unknown>][] {
  const properties = schema['properties'];
  if (typeof properties !== 'object' || properties === null) {
    return [];
  }
  return Object.entries(properties as Record<string, Record<string, unknown>>);
}

describe('tool declarations', () => {
  it('gives every tool a human title from the catalog, not its function name', () => {
    for (const tool of ALL_TOOLS) {
      const declared = declareTool(tool, false);
      expect(declared.title, tool.name).not.toBe(tool.name);
      expect(declared.title).not.toContain('_');
      expect(declared.annotations.title).toBe(declared.title);
    }
  });

  it('describes every argument of every tool, including array items', () => {
    for (const tool of ALL_TOOLS) {
      const schema = declareTool(tool, false).inputSchema;
      for (const [field, property] of propertiesOf(schema)) {
        expect(typeof property['description'], `${tool.name}.${field}`).toBe('string');
        const items = property['items'];
        if (typeof items === 'object' && items !== null) {
          for (const [inner, innerProperty] of propertiesOf(items as Record<string, unknown>)) {
            expect(typeof innerProperty['description'], `${tool.name}.${field}[].${inner}`).toBe(
              'string',
            );
          }
        }
      }
    }
  });

  it('marks reads idempotent and read only, and a URL import as open world', () => {
    for (const tool of ALL_TOOLS) {
      const { annotations } = declareTool(tool, false);
      if (tool.risk === 'read') {
        expect(annotations.readOnlyHint, tool.name).toBe(true);
        expect(annotations.idempotentHint, tool.name).toBe(true);
      }
    }
    const importMedia = ALL_TOOLS.find((tool) => tool.name === 'import_media');
    expect(importMedia && declareTool(importMedia, false).annotations.openWorldHint).toBe(true);
    const draft = ALL_TOOLS.find((tool) => tool.name === 'draft_post');
    expect(draft && declareTool(draft, false).annotations.openWorldHint).toBe(false);
  });

  it('tells the model where a project id comes from', () => {
    expect(SERVER_INSTRUCTIONS).toContain('list_projects');
    expect(SERVER_INSTRUCTIONS).not.toMatch(/—/);
  });
});

describe('tool results', () => {
  it('sends no resource links, because this server offers no resources', () => {
    const result = toCallToolResult({
      data: { ok: true },
      resourceLinks: [{ uri: 'relay://content/x', name: 'draft', description: 'A draft.' }],
    });
    expect(result['content']).toEqual([{ type: 'text', text: '{"ok":true}' }]);
  });

  it('carries a plain English message beside the stable code', () => {
    const problem = new RelayError('SCOPE_INSUFFICIENT', {
      messageKey: 'error.insufficient_scope.message',
      details: { tool: 'publish_post' },
    }).toProblemJson();
    const result = toCallToolError(problem);
    const structured = result['structuredContent'] as Record<string, unknown>;
    expect(structured['code']).toBe('SCOPE_INSUFFICIENT');
    expect(structured['messageKey']).toBe('error.insufficient_scope.message');
    expect(typeof structured['message']).toBe('string');
    expect(structured['message']).not.toBe('error.insufficient_scope.message');
    expect(String(structured['message']).length).toBeGreaterThan(10);
    expect(result['isError']).toBe(true);
  });
});
