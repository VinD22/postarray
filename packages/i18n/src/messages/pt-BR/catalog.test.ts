import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { en } from '../en/index';
import { ptBR } from './index';

describe('Brazilian Portuguese beta catalog', () => {
  it('keeps ICU syntax and English argument names', () => {
    const result = lintCatalog(ptBR, { locale: 'pt-BR', reference: en, requireCoverage: false });
    expect(result.findings).toEqual([]);
  });

  it('leaves legal, billing, and consent copy to the English fallback', () => {
    expect(ptBR).not.toHaveProperty('billing.title');
    expect(ptBR).not.toHaveProperty('settings.data.title');
    expect(ptBR).not.toHaveProperty('web.pricing.title');
    expect(en).toHaveProperty('billing.title');
    expect(en).toHaveProperty('settings.data.title');
    expect(en).toHaveProperty('web.pricing.title');
  });

  it('translates the eleven content namespaces this locale carries in full', () => {
    expect(ptBR).toHaveProperty('web.blog.title');
    expect(ptBR).toHaveProperty('web.tools.index.title');
    expect(ptBR).toHaveProperty('web.schedule.index.title');
    expect(ptBR).toHaveProperty('web.useCases.index.title');
    expect(ptBR).toHaveProperty('web.comparison.eyebrow');
    expect(ptBR).toHaveProperty('web.demo.title');
    expect(ptBR).toHaveProperty('import.title');
    expect(ptBR).toHaveProperty('queue.title');
    expect(ptBR).toHaveProperty('set.title');
    expect(ptBR).toHaveProperty('mediaLib.derivative.heading');
    expect(ptBR).toHaveProperty('email.invitation.subject');
  });
});
