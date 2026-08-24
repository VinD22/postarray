import { ImageResponse } from 'next/og';

/**
 * The home screen icon, the favicon's larger sibling.
 *
 * Same three by three array as `icon.tsx`, drawn at 180px with proportionally
 * larger cells and gutters rather than a scaled up 32px grid, so the mark reads
 * as deliberate at the size iOS actually renders it.
 *
 * The track is sized explicitly instead of wrapping: a flex-wrap row whose
 * content is a pixel wider than its box silently reflows to two columns, which
 * is how this icon first rendered as a two by three grid with the accent cell
 * pushed out of the corner.
 */

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const INK = '#141413';
const PAPER = '#fffcf8';
const TERRACOTTA = '#b4462b';

const CELL = 40;
const GAP = 16;
const ROWS = [0, 1, 2];

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: GAP,
        background: PAPER,
      }}
    >
      {ROWS.map((row) => (
        <div key={row} style={{ display: 'flex', gap: GAP }}>
          {ROWS.map((column) => (
            <div
              key={column}
              style={{
                display: 'flex',
                width: CELL,
                height: CELL,
                borderRadius: 6,
                background: row === 0 && column === 0 ? TERRACOTTA : INK,
              }}
            />
          ))}
        </div>
      ))}
    </div>,
    size,
  );
}
