import type { ComponentProps, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getStaticIntlMock } = vi.hoisted(() => ({
  getStaticIntlMock: vi.fn(),
}));

vi.mock('@/lib/i18n/server', () => ({ getStaticIntl: getStaticIntlMock }));
vi.mock('@/components/link', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));

import AuthLayout from './layout';

describe('auth layout locale binding', () => {
  beforeEach(() => {
    getStaticIntlMock.mockReset();
    getStaticIntlMock.mockImplementation(async (locale = 'en') => ({
      t: { format: (key: string) => `${locale}:${key}` },
    }));
  });

  it('loads the catalog for the locale in the route params', async () => {
    const children: ReactNode = <p>form</p>;

    render(
      await AuthLayout({
        children,
        params: Promise.resolve({ locale: 'ar' }),
      }),
    );

    expect(getStaticIntlMock).toHaveBeenCalledWith('ar');
    expect(screen.getByText('ar:auth.aside.title')).toBeInTheDocument();
    expect(screen.getByText('ar:shell.appName')).toBeInTheDocument();
  });
});
