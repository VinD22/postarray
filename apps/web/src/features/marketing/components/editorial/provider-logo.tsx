import type { ComponentType, ReactNode } from 'react';
import { Facebook, Instagram, Linkedin, Store, Youtube } from 'lucide-react';
import type { CoreProviderId } from '@relay/contracts';
import { cn } from '@relay/design-system/utils';

/**
 * One platform's mark, at logo scale, in its own brand colour.
 *
 * ## Why this is allowed at all
 *
 * `packages/design-system/README.md` permits a provider brand colour in three
 * places and no more: an 8px identity dot, a 1px rule, and a logo at logo
 * scale inside a provider row where the platform's NAME is present as text in
 * the same cell. This component is built for that third case and carries its
 * conditions in its own API: it renders a mark only, it never paints a
 * surface, and `ProviderLogoRow` is the only thing that renders it — always
 * beside the translated platform name. Colour is therefore never the sole
 * identifier, which is what keeps the row readable under a colour vision
 * deficiency, in greyscale and under a print stylesheet.
 *
 * ## Why the art is split between two sources
 *
 * `lucide-react` still ships marks for four of the launch cohort
 * (Instagram, Facebook, LinkedIn, YouTube) and one honest stand-in
 * (`Store`, for Google Business Profile, whose real mark is a multicolour
 * storefront that cannot be drawn in one colour without misrepresenting it).
 * The other five were removed from Lucide, or never existed there, so they are
 * authored here as single-path glyphs. Nothing here is an emoji standing in
 * for an icon, and nothing is a coloured block standing in for a logo.
 *
 * ## Why the record is keyed by `CoreProviderId`
 *
 * It is a total record over the launch cohort in `@relay/contracts`. A
 * provider added to `CORE_PROVIDER_IDS` fails to compile here until it has a
 * mark, so the hero row can never quietly show nine platforms while the
 * connect dialog offers ten.
 */

export interface ProviderGlyphProps {
  readonly className?: string;
}

type ProviderGlyph = ComponentType<ProviderGlyphProps>;

/** The shared frame every authored glyph is drawn in. */
function Glyph({
  className,
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

function XGlyph({ className }: ProviderGlyphProps): ReactNode {
  return (
    <Glyph className={className}>
      <path d="M17.53 3h2.9l-6.34 7.24L21.5 21h-5.66l-4.44-5.8L6.3 21H3.4l6.78-7.75L2.7 3h5.8l4.02 5.31zm-1.02 16.2h1.6L7.57 4.71H5.85z" />
    </Glyph>
  );
}

function TikTokGlyph({ className }: ProviderGlyphProps): ReactNode {
  return (
    <Glyph className={className}>
      <path d="M16.5 3h-2.9v12.1a2.6 2.6 0 1 1-2.1-2.55V9.5a5.7 5.7 0 1 0 5 5.66V9.35a7.3 7.3 0 0 0 4.2 1.33V7.79a4.4 4.4 0 0 1-4.2-4.4z" />
    </Glyph>
  );
}

function PinterestGlyph({ className }: ProviderGlyphProps): ReactNode {
  return (
    <Glyph className={className}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3.46 18.35c-.08-.78-.15-1.98.03-2.83.17-.79 1.1-5.05 1.1-5.05s-.28-.57-.28-1.4c0-1.32.76-2.3 1.71-2.3.8 0 1.2.61 1.2 1.34 0 .81-.52 2.03-.79 3.16-.23.94.47 1.71 1.4 1.71 1.68 0 2.98-1.77 2.98-4.33 0-2.26-1.63-3.85-3.95-3.85-2.69 0-4.27 2.02-4.27 4.1 0 .82.31 1.7.7 2.17.08.1.09.18.07.28-.07.3-.24.94-.27 1.07-.04.17-.14.21-.32.13-1.19-.56-1.93-2.29-1.93-3.69 0-3 2.18-5.76 6.28-5.76 3.3 0 5.86 2.35 5.86 5.49 0 3.27-2.06 5.91-4.92 5.91-.96 0-1.87-.5-2.18-1.1l-.59 2.27c-.21.82-.79 1.84-1.18 2.46A9.5 9.5 0 1 0 12 2.5z" />
    </Glyph>
  );
}

function BlueskyGlyph({ className }: ProviderGlyphProps): ReactNode {
  return (
    <Glyph className={className}>
      <path d="M6.2 4.6C8.5 6.35 10.98 9.9 12 12.06c1.02-2.16 3.5-5.71 5.8-7.46C19.5 3.31 22 2.4 22 5.3c0 .58-.33 4.83-.52 5.52-.66 2.4-3.1 3.01-5.28 2.64 3.8.65 4.77 2.8 2.68 4.95-3.97 4.07-5.71-1.02-6.16-2.33-.08-.24-.12-.35-.12-.26 0-.09-.04.02-.12.26-.45 1.31-2.19 6.4-6.16 2.33-2.09-2.15-1.12-4.3 2.68-4.95-2.18.37-4.62-.24-5.28-2.64C2.53 10.13 2.2 5.88 2.2 5.3c0-2.9 2.5-1.99 4-.7z" />
    </Glyph>
  );
}

function ThreadsGlyph({ className }: ProviderGlyphProps): ReactNode {
  return (
    <Glyph className={className}>
      <path d="M16.9 11.34a7.2 7.2 0 0 0-.28-.13c-.17-3.06-1.84-4.81-4.65-4.83h-.04c-1.68 0-3.08.72-3.94 2.03l1.55 1.06c.64-.97 1.64-1.17 2.39-1.17h.03c.93.01 1.63.28 2.09.8.33.38.55.9.66 1.56a12.1 12.1 0 0 0-2.71-.13c-2.73.16-4.48 1.75-4.36 3.97.06 1.12.62 2.09 1.58 2.72.81.53 1.85.79 2.94.73 1.43-.08 2.55-.63 3.34-1.63.6-.76.98-1.75 1.15-2.99.7.42 1.21.97 1.5 1.63.48 1.13.51 2.98-1 4.49-1.32 1.32-2.91 1.9-5.3 1.91-2.66-.02-4.67-.87-5.98-2.53C4.65 16.9 4.02 14.72 4 12c.02-2.72.65-4.9 1.86-6.44C7.17 3.9 9.18 3.05 11.84 3.03c2.68.02 4.72.88 6.07 2.55.66.82 1.16 1.85 1.49 3.05l1.83-.49c-.4-1.47-1.03-2.75-1.88-3.81C17.62 2.2 15.07 1.05 11.85 1.03h-.01C8.62 1.05 6.1 2.2 4.35 4.44 2.79 6.43 1.99 9.2 1.97 11.99v.02c.02 2.79.82 5.56 2.38 7.55C6.1 21.8 8.62 22.95 11.84 22.97h.01c2.86-.02 4.88-.77 6.55-2.44 2.18-2.18 2.12-4.91 1.4-6.58-.52-1.2-1.51-2.17-2.9-2.61zm-4.51 4.65c-1.2.07-2.45-.47-2.51-1.61-.05-.85.6-1.79 2.58-1.9l.4-.01c.72 0 1.4.07 2.01.2-.23 2.85-1.57 3.26-2.48 3.32z" />
    </Glyph>
  );
}

/**
 * The mark per cohort platform. Total over `CoreProviderId` on purpose: see
 * the header. `Store` is a stand-in rather than a brand mark, which is why the
 * name beside it always reads "Google Business Profile" in full.
 */
const PROVIDER_GLYPH: Readonly<Record<CoreProviderId, ProviderGlyph>> = {
  x: XGlyph,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: TikTokGlyph,
  youtube: Youtube,
  pinterest: PinterestGlyph,
  bluesky: BlueskyGlyph,
  threads: ThreadsGlyph,
  google_business_profile: Store,
};

/**
 * The brand colour class per cohort platform. Written out rather than built
 * from the id, because Tailwind resolves utilities from source text: a
 * template literal would compile to no colour at all.
 *
 * Every value here is `--brand-*` from `theme.css`, which is theme-aware — the
 * near-black marks (X, TikTok, Threads) lighten in the dark theme rather than
 * disappearing into the ink ground.
 */
const PROVIDER_BRAND_TEXT: Readonly<Record<CoreProviderId, string>> = {
  x: 'text-brand-x',
  instagram: 'text-brand-instagram',
  facebook: 'text-brand-facebook',
  linkedin: 'text-brand-linkedin',
  tiktok: 'text-brand-tiktok',
  youtube: 'text-brand-youtube',
  pinterest: 'text-brand-pinterest',
  bluesky: 'text-brand-bluesky',
  threads: 'text-brand-threads',
  google_business_profile: 'text-brand-google-business-profile',
};

export interface ProviderLogoProps {
  readonly provider: CoreProviderId;
  readonly className?: string;
}

/**
 * The mark alone, always `aria-hidden`: the caller renders the platform name
 * as text beside it, so announcing the logo would name the platform twice.
 */
export function ProviderLogo({ provider, className }: ProviderLogoProps): ReactNode {
  const Mark = PROVIDER_GLYPH[provider];
  return <Mark className={cn('size-5 shrink-0', PROVIDER_BRAND_TEXT[provider], className)} />;
}
