import { describe, expect, it } from 'vitest';
import { ASSISTANT_TOOLS } from '@relay/contracts';

import { ALL_TOOLS } from './index';

/**
 * The in-app assistant and an external agent must behave identically.
 *
 * `packages/contracts` declares the assistant's documented subset by naming the
 * MCP tool each entry is. This test is the enforcement: a name that does not
 * exist here, or a risk or confirmation requirement that disagrees with the
 * registry, fails the build rather than quietly creating a second catalog with
 * a looser gate.
 */

const byName = new Map(ALL_TOOLS.map((tool) => [tool.name, tool] as const));

describe('the assistant subset of the MCP catalog', () => {
  it('names only tools this registry actually exposes', () => {
    for (const assistant of ASSISTANT_TOOLS) {
      if (assistant.mcpTool === null) {
        continue;
      }
      expect(byName.has(assistant.mcpTool)).toBe(true);
    }
  });

  it('carries the same risk as the tool it refers to', () => {
    for (const assistant of ASSISTANT_TOOLS) {
      if (assistant.mcpTool === null) {
        continue;
      }
      expect(byName.get(assistant.mcpTool)?.risk).toBe(assistant.risk);
    }
  });

  it('never lets the assistant skip a confirmation the MCP tool requires', () => {
    for (const assistant of ASSISTANT_TOOLS) {
      const mcp = assistant.mcpTool === null ? undefined : byName.get(assistant.mcpTool);
      if (mcp?.requiresHumanConfirmation === true) {
        expect(assistant.requiresHumanConfirmation).toBe(true);
      }
    }
  });

  it('explains every tool it does not share with the external catalog', () => {
    for (const assistant of ASSISTANT_TOOLS) {
      if (assistant.mcpTool === null) {
        expect(assistant.mcpAbsenceReason.length).toBeGreaterThan(20);
      }
    }
  });

  it('exposes no tool that generates an image or a video', () => {
    for (const assistant of ASSISTANT_TOOLS) {
      expect(assistant.name).not.toMatch(/image|video|media_generat/);
    }
  });
});
