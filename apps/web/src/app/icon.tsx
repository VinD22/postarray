import { ImageResponse } from 'next/og';

/**
 * The favicon, generated rather than committed as a binary.
 *
 * The mark is the name: a three by three array of posts, with the first cell
 * carrying the accent. It survives the size it is actually seen at. A wordmark
 * does not, and a lone letter P is the mark of every product beginning with P.
 *
 * Generated for the same reason the share card is: the product was renamed
 * once already, and an asset that is code follows a rename for free.
 */

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const INK = '#141413';
const PAPER = '#fffcf8';
const TERRACOTTA = '#b4462b';

const CELL = 8;
const GAP = 3;
const ROWS = [0, 1, 2];

export default function Icon(): ImageResponse {
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
                borderRadius: 1,
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
