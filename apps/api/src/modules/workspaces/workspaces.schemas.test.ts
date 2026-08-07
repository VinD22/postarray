import { describe, expect, it } from 'vitest';

import { updateWorkspaceSchema } from './workspaces.schemas';

describe('workspace localization input', () => {
  it('accepts the persisted locale, market, calendar and clock preferences', () => {
    expect(
      updateWorkspaceSchema.parse({
        defaultLocale: 'pt-BR',
        ianaTimeZone: 'Asia/Kolkata',
        contentLocales: ['en', 'pt-BR'],
        markets: ['India', 'Brazil'],
        weekStart: 1,
        hourCycle: 'h23',
      }),
    ).toEqual({
      defaultLocale: 'pt-BR',
      ianaTimeZone: 'Asia/Kolkata',
      contentLocales: ['en', 'pt-BR'],
      markets: ['India', 'Brazil'],
      weekStart: 1,
      hourCycle: 'h23',
    });
  });

  it('rejects an empty content locale list and ambiguous week starts', () => {
    expect(() => updateWorkspaceSchema.parse({ contentLocales: [] })).toThrow();
    expect(() => updateWorkspaceSchema.parse({ weekStart: 2 })).toThrow();
  });
});
