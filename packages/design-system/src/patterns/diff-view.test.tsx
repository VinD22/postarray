import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiffView, type DiffSegment, type DiffViewMessages } from './diff-view';

// Fixtures only. Product copy lives in @relay/i18n.
const segments: readonly DiffSegment[] = [
  { id: 's0', operation: 'unchanged', text: 'We are hiring ' },
  { id: 's1', operation: 'removed', text: 'a dev' },
  { id: 's2', operation: 'added', text: 'two engineers' },
  { id: 's3', operation: 'unchanged', text: ' in Lisbon. ' },
  { id: 's4', operation: 'added', text: 'Apply by Friday.' },
];

const messages: DiffViewMessages = {
  regionLabel: 'Suggested rewrite',
  beforeLabel: 'Now',
  afterLabel: 'Suggested',
  acceptLabel: 'Accept all',
  rejectLabel: 'Reject',
  addedAnnotation: 'added',
  removedAnnotation: 'removed',
};

describe('DiffView, whole-suggestion mode', () => {
  it('names the region and shows both columns', () => {
    render(
      <DiffView
        segments={segments}
        messages={messages}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />,
    );

    expect(screen.getByRole('region', { name: 'Suggested rewrite' })).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeVisible();
    expect(screen.getByText('Suggested')).toBeVisible();
  });

  it('marks each run with an element, a tint and a word, never colour alone', () => {
    const { container } = render(
      <DiffView segments={segments} messages={messages} onAccept={vi.fn()} onReject={vi.fn()} />,
    );

    const removed = container.querySelector('del');
    const added = container.querySelector('ins');
    expect(removed).toHaveTextContent('a dev');
    expect(removed).toHaveTextContent('removed');
    expect(added).toHaveTextContent('two engineers');
    expect(added).toHaveTextContent('added');
  });

  it('keeps a removed run out of the proposed column and vice versa', () => {
    const { container } = render(
      <DiffView segments={segments} messages={messages} onAccept={vi.fn()} onReject={vi.fn()} />,
    );

    expect(container.querySelectorAll('del')).toHaveLength(1);
    expect(container.querySelectorAll('ins')).toHaveLength(2);
  });

  it('offers exactly two buttons when no per-segment handler is supplied', () => {
    render(
      <DiffView segments={segments} messages={messages} onAccept={vi.fn()} onReject={vi.fn()} />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('reports accept and reject separately', async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(
      <DiffView
        segments={segments}
        messages={messages}
        onAccept={onAccept}
        onReject={onReject}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Accept all' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onReject).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('disables both decisions while one is being applied', () => {
    render(
      <DiffView
        segments={segments}
        messages={messages}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        busy
      />,
    );
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });
});

describe('DiffView, per-segment mode', () => {
  const perSegmentMessages: DiffViewMessages = {
    ...messages,
    acceptSegmentLabel: (segment) => `Accept "${segment.text}"`,
  };

  const renderPerSegment = (onAcceptSegment = vi.fn(), busy = false) => {
    render(
      <DiffView
        segments={segments}
        messages={perSegmentMessages}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onAcceptSegment={onAcceptSegment}
        busy={busy}
      />,
    );
    return onAcceptSegment;
  };

  it('puts one named control after every inserted and deleted run', () => {
    renderPerSegment();

    expect(screen.getByRole('button', { name: 'Accept "a dev"' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Accept "two engineers"' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Accept "Apply by Friday."' })).toBeVisible();
  });

  it('leaves unchanged runs alone: three segment controls plus the two decisions', () => {
    renderPerSegment();
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('reports the segment index in the original list, not in the column', async () => {
    const onAcceptSegment = renderPerSegment();
    const user = userEvent.setup();

    // 'Apply by Friday.' is index 4 of `segments` but the second insert in the
    // proposed column. The caller gets the index it can act on.
    await user.click(screen.getByRole('button', { name: 'Accept "Apply by Friday."' }));
    expect(onAcceptSegment).toHaveBeenCalledTimes(1);
    expect(onAcceptSegment).toHaveBeenCalledWith(4);
  });

  it('reports a deletion by its own index, from the current column', async () => {
    const onAcceptSegment = renderPerSegment();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Accept "a dev"' }));
    expect(onAcceptSegment).toHaveBeenCalledWith(1);
  });

  it('keeps the whole-suggestion decision working unchanged', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(
      <DiffView
        segments={segments}
        messages={perSegmentMessages}
        onAccept={onAccept}
        onReject={vi.fn()}
        onAcceptSegment={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Accept all' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('disables the segment controls along with everything else while busy', () => {
    renderPerSegment(vi.fn(), true);
    expect(screen.getByRole('button', { name: 'Accept "a dev"' })).toBeDisabled();
  });

  it('renders no segment control when the caller supplies no name for it', () => {
    // An icon-only button with no accessible name is not a control, so the
    // handler alone is not enough to put one on screen.
    render(
      <DiffView
        segments={segments}
        messages={messages}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onAcceptSegment={vi.fn()}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
