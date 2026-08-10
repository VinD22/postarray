import { ImageResponse } from 'next/og';
import { en } from '@relay/i18n';

/**
 * The one social share image.
 *
 * Deliberately locale neutral. A per locale card would mean 25 rendered
 * variants of the same wordmark, all of which would need re-rendering the day
 * the product is named, in exchange for a translated word almost nobody reads
 * inside a share preview. So the card carries the wordmark, the ink rule and
 * the paper ground, and nothing that needs translating.
 *
 * The brand name is read from the catalog rather than typed here, because
 * naming is still an open founder decision and this asset must follow it.
 *
 * There is no product screenshot on it. Nothing here has shipped yet, and a
 * drawn interface on a share card is a fabricated screenshot.
 */

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export const alt = en['web.brand.name'];

const PAPER = '#fffcf8';
const INK = '#141413';
const TERRACOTTA = '#b4462b';

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        color: INK,
        padding: 72,
        border: `8px solid ${INK}`,
      }}
    >
      <div style={{ display: 'flex', width: 96, height: 8, background: TERRACOTTA }} />
      <div
        style={{
          display: 'flex',
          fontSize: 132,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {en['web.brand.name']}
      </div>
      <div style={{ display: 'flex', height: 8, background: INK }} />
    </div>,
    size,
  );
}
