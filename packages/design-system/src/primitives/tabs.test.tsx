import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// Test fixtures only. Product copy lives in @relay/i18n.
const TABS = [
  { value: 'linkedin', label: 'LinkedIn', body: 'LinkedIn variant' },
  { value: 'x', label: 'X', body: 'X variant' },
  { value: 'tiktok', label: 'TikTok', body: 'TikTok variant' },
] as const;

function Example({ dir }: { dir?: 'ltr' | 'rtl' }): ReactNode {
  return (
    <Tabs defaultValue="linkedin" dir={dir}>
      <TabsList aria-label="Targets">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}

describe('Tabs', () => {
  it('exposes a tablist with one selected tab', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Targets' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('LinkedIn');
  });

  it('shows only the selected panel', () => {
    render(<Example />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('LinkedIn variant');
    expect(screen.queryByText('X variant')).not.toBeInTheDocument();
  });

  it('is a single tab stop', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'LinkedIn' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tab', { name: 'X' })).not.toHaveFocus();
  });

  it('moves focus with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'X' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'LinkedIn' })).toHaveFocus();
  });

  it('wraps from the last tab to the first', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'LinkedIn' })).toHaveFocus();
  });

  it('selects on click and swaps the panel', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: 'TikTok' }));
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('TikTok');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('TikTok variant');
  });

  it('reverses arrow direction in RTL', async () => {
    const user = userEvent.setup();
    render(<Example dir="rtl" />);
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'X' })).toHaveFocus();
  });

  it('associates each tab with its panel', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: 'X' }));
    const tab = screen.getByRole('tab', { selected: true });
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });
});
