import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notice } from './notice';

// Test fixtures only. Product copy lives in @relay/i18n.
describe('Notice', () => {
  it('stacks its actions under the title on a 390px phone', () => {
    // The theme sets --breakpoint-sm to 390px, so an `sm:` row would apply on
    // the phone itself and squeeze the title beside the action buttons.
    render(<Notice tone="warning" title="Needs a decision" actions={<button>Open</button>} />);
    const actions = screen.getByRole('button', { name: 'Open' }).parentElement;
    const className = actions?.className ?? '';
    expect(className).toMatch(/(^|\s)w-full(\s|$)/);
    expect(className).toMatch(/\bmd:w-auto\b/);
    expect(className).not.toMatch(/\bsm:/);
  });
});
