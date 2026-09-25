import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroWebglStage } from './hero-webgl-stage';

const gate = vi.hoisted(() => ({ allowed: true }));
vi.mock('./webgl-guard', () => ({ useWebglAllowed: () => gate.allowed }));
vi.mock('@/lib/i18n', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('next/dynamic', () => ({
  default: () => (props: { active: boolean }) => (
    <span data-testid="canvas" data-active={props.active} />
  ),
}));
vi.mock('./publish-fanout-fallback', () => ({
  PublishFanoutFallback: () => <span data-testid="fallback" />,
}));

afterEach(() => {
  vi.unstubAllGlobals();
  gate.allowed = true;
});
function allowIntersection() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
      observe() {
        this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
}

describe('decorative WebGL lifecycle', () => {
  it('supports pausing and stops rendering if motion preference changes after mounting', async () => {
    allowIntersection();
    const { rerender } = render(<HeroWebglStage />);
    await waitFor(() =>
      expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'true'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'web.motion.pause' }));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'web.motion.play' }));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'true');
    gate.allowed = false;
    rerender(<HeroWebglStage />);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
  it('does not mount a canvas without an intersection observer', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<HeroWebglStage />);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
});
