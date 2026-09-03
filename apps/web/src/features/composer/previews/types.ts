/**
 * The preview's own view models.
 *
 * A preview component receives one `PreviewModel` and nothing else. It never
 * reads the composer state, never reads a capability snapshot and never knows
 * a provider limit, because every fact it could need has already been resolved
 * into the model by `build-preview-model.ts`. That is what keeps nineteen
 * provider files from each growing their own idea of what X allows.
 */

import type {
  CapabilitySupport,
  ContentKind,
  MediaKind,
  ProviderId,
} from '@relay/contracts';
import type { MessageKey } from '@relay/i18n';

export type PreviewDevice = 'mobile' | 'desktop';

/** Where the frame's key is stored so the choice survives a reload. */
export const PREVIEW_DEVICE_STORAGE_KEY = 'pa:preview-device';

/**
 * How a platform lays a post out. Every field is either sourced from the
 * provider's own documentation or `null`, and `null` means the preview does
 * not pretend. See `presentation-rules.ts`.
 */
export interface PresentationRule {
  /**
   * Where the platform stops showing text and offers "See more". Null means we
   * could not source a threshold, so the preview shows the whole body.
   */
  readonly collapse: {
    readonly afterChars: number | null;
    readonly afterLines: number | null;
    readonly labelKey: MessageKey;
  } | null;
  /**
   * `square` when the platform crops attachments to a square, `aspect` when it
   * keeps the file's own ratio, `stacked` when each attachment gets its own
   * full width row.
   */
  readonly mediaGrid: 'square' | 'aspect' | 'stacked';
  /** Null means the platform renders no link preview card at all. */
  readonly linkCard: 'large' | 'compact' | null;
  /** True when the platform's post carries a title separate from the body. */
  readonly showsTitle: boolean;
  /** Frame widths in CSS pixels. Ours, not the platform's. See the rules file. */
  readonly desktopWidth: number;
  readonly mobileWidth: number;
}

export interface PreviewAccount {
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
}

export interface PreviewLink {
  readonly url: string;
  readonly domain: string;
  /** Never invented. Null until real metadata is fetched for this URL. */
  readonly title: string | null;
  readonly description: string | null;
}

export interface PreviewMedia {
  readonly id: string;
  readonly kind: MediaKind;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  /** False when this attachment is past the platform's maximum for its kind. */
  readonly sent: boolean;
  /** False when the stored file cannot be read right now. */
  readonly available: boolean;
  /** Still loading its metadata or its read URL. */
  readonly loading: boolean;
  /** A signed thumbnail or poster URL. Null until BE-1 returns one. */
  readonly thumbnailUrl: string | null;
}

export interface PreviewThreadItem {
  readonly id: string;
  readonly text: string;
  readonly mediaIds: readonly string[];
  readonly delaySeconds: number;
}

export interface PreviewCounter {
  readonly used: number;
  readonly max: number;
  readonly remaining: number;
  readonly over: boolean;
  readonly nearLimit: boolean;
}

export interface PreviewModel {
  readonly provider: ProviderId;
  readonly account: PreviewAccount;
  readonly contentKind: ContentKind;
  /** Straight from `snapshot.contentKinds[contentKind]`. Never widened. */
  readonly kindSupport: CapabilitySupport;
  readonly text: string;
  readonly title: string | null;
  readonly links: readonly PreviewLink[];
  readonly media: readonly PreviewMedia[];
  readonly threadItems: readonly PreviewThreadItem[];
  readonly counter: PreviewCounter;
  readonly presentation: PresentationRule;
  /** Already translated and formatted by the caller. */
  readonly postedAtLabel: string;
  /** True only when `snapshot.media.altText === 'supported'`. */
  readonly showsAltText: boolean;
  /** True only when `snapshot.mentions.support === 'supported'`. */
  readonly resolvesMentions: boolean;
  /** How many thread items the platform accepts. Zero means none. */
  readonly maxThreadItems: number;
  /** The exact URL that will publish, when the draft has one. */
  readonly publishedUrl: string | null;
  /** The destination the post lands in, when the platform has one. */
  readonly destinationLabel: string | null;
}

export interface PreviewProps {
  readonly model: PreviewModel;
  readonly device: PreviewDevice;
}

export type PreviewComponent = (props: PreviewProps) => import('react').ReactNode;
