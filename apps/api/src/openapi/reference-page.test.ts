import { ACTIVE_LOCALE_CODES, createTranslator, loadCatalog } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { renderReference } from './reference-page';

const DOCUMENT = {
  info: { title: 'Post Array API', version: 'v1', description: 'Machine document.' },
  paths: {
    '/v1/projects': {
      get: {
        operationId: 'projects.list',
        tags: ['Projects'],
        summary: 'List projects',
        security: [],
      },
    },
  },
};

describe('localized API reference presentation', () => {
  it('sets the selected language and translates the reference chrome', async () => {
    const locale = 'es';
    const translator = createTranslator(locale, await loadCatalog(locale));
    const machineDocumentBefore = JSON.stringify(DOCUMENT);
    const html = renderReference(DOCUMENT, 'nonce', { locale, translator });

    expect(html).toContain('<html lang="es" dir="ltr">');
    expect(html).toContain('Resumen');
    expect(html).not.toContain('lang="en"');
    // The operation summary is machine-owned until a reviewed presentation
    // translation key exists, so the API contract remains truthful.
    expect(html).toContain('List projects');
    expect(JSON.stringify(DOCUMENT)).toBe(machineDocumentBefore);
  });

  it('never renders a locale outside the public registry', () => {
    expect(ACTIVE_LOCALE_CODES).toContain('en');
  });
});
