import { Button } from '@relay/design-system/primitives';

import { Link } from '@/components/link';
import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The `(app)` group's 404 (WP-11 — global boundaries).
 *
 * A compact version of the public 404 (`(marketing)/not-found.tsx`): the
 * same "404" numeral next to a purely decorative, `aria-hidden` slow-turning
 * dashed circle, at a smaller display size, and no `MagneticButton` — this
 * boundary renders inside the signed-in shell, where the marketing tier's
 * pointer-follow flourish is a named, deliberately narrow exception
 * (`components/motion/README.md`) that this route does not need to widen.
 * Next.js does not pass the `[locale]` segment's params to a `not-found.tsx`
 * boundary, so, matching both existing `not-found.tsx` boundaries, the
 * locale comes from `getRequestIntl()` rather than a route param.
 */
export default async function AppNotFound() {
  const { t } = await getRequestIntl();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-16 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="sr-only">{t.t('error.not_found.message')}</h1>
        <p
          aria-hidden="true"
          className="font-display text-display-lg text-text-primary leading-none"
        >
          404
        </p>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="relay-slow-spin text-border-bold hidden size-12 shrink-0 md:block"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      <p className="text-body-lg text-text-secondary max-w-[52ch] leading-[1.6]">
        {t.t('error.not_found.action')}
      </p>

      <div>
        <Button variant="cta" asChild>
          <Link href="/">{t.t('nav.home')}</Link>
        </Button>
      </div>
    </div>
  );
}
