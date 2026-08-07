/**
 * The single seam between live requests and seeded demo data.
 *
 * Every resource method calls `call`, passing the value available in explicit
 * local demo mode. An absent or unreachable production API always follows the
 * typed error path and never returns fixtures.
 */

import { apiConfig } from './config';
import { request, type RequestOptions } from './transport';

export async function call<Wire, View = Wire>(
  path: string,
  options: RequestOptions,
  demo: () => View,
  transform?: (wire: Wire) => View,
): Promise<View> {
  if (apiConfig.mode === 'demo') {
    // A short delay keeps loading states honest during review.
    await new Promise((resolve) => setTimeout(resolve, 120));
    return demo();
  }
  const wire = await request<Wire>(path, options);
  return transform === undefined ? (wire as unknown as View) : transform(wire);
}

export type { RequestOptions };
