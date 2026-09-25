import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '@relay/design-system/primitives';
import { createTranslator, en } from '@relay/i18n';
import { ContextPicker } from './context-picker';

const { switchContext, onClose, push } = vi.hoisted(() => ({
  switchContext: vi.fn(),
  onClose: vi.fn(),
  push: vi.fn(),
}));
const translate = createTranslator('en', en);
vi.mock('@/lib/i18n', () => ({
  useTranslations: () => translate.format,
  useLocalizedRouter: () => ({ push }),
}));
vi.mock('@/lib/auth/use-context-switch', () => ({ useContextSwitch: () => switchContext }));
vi.mock('@/lib/auth/session-context', () => ({
  useSession: () => ({
    workspace: { id: 'ws_one' },
    project: { id: 'project_1' },
    session: {
      projects: Array.from({ length: 100 }, (_, i) => ({
        id: `project_${i + 1}`,
        name: `Client ${String(i + 1).padStart(3, '0')}`,
        connectionIds: [],
      })),
      workspaces: [{ id: 'ws_one', name: 'Agency workspace', timeZone: 'Asia/Kolkata' }],
    },
  }),
}));

beforeEach(() => vi.clearAllMocks());

function openPicker() {
  render(
    <Dialog open>
      <ContextPicker onClose={onClose} />
    </Dialog>,
  );
}

describe('agency context picker', () => {
  it('finds client 100 without traversing 99 other clients and selects it with Enter', async () => {
    openPicker();
    const search = screen.getByRole('combobox');
    await waitFor(() => expect(search).toHaveFocus());
    fireEvent.change(search, { target: { value: ' CLIENT 100 ' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Client 100');
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(switchContext).toHaveBeenCalledWith({
      kind: 'project',
      id: 'project_100',
      name: 'Client 100',
      current: false,
      detail: 'Project · 0 connected accounts',
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps keyboard selection linked to an existing result, including after filtering', () => {
    openPicker();
    const search = screen.getByRole('combobox');
    fireEvent.keyDown(search, { key: 'ArrowUp' });
    expect(
      document.getElementById(search.getAttribute('aria-activedescendant') ?? ''),
    ).toHaveTextContent('Agency workspace');
    fireEvent.change(search, { target: { value: 'missing client' } });
    expect(search).not.toHaveAttribute('aria-activedescendant');
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(switchContext).not.toHaveBeenCalled();
    expect(screen.getByText('No projects or workspaces match. Try another name.')).toBeVisible();
  });
});
