/**
 * The single seam between live requests and seeded demo data.
 *
 * Every resource method calls `call`, passing the demo value it would return if
 * the API is not reachable. That keeps the demo behaviour next to the real
 * behaviour instead of in a parallel mock layer that drifts.
 */

import { apiConfig } from './config';
import { request, type RequestOptions } from './transport';

export async function call<T>(path: string, options: RequestOptions, demo: () => T): Promise<T> {
  if (apiConfig.mode === 'demo') {
    // A short delay keeps loading states honest during review.
    await new Promise((resolve) => setTimeout(resolve, 120));
    return demo();
  }
  return request<T>(path, options);
}

export type { RequestOptions };
