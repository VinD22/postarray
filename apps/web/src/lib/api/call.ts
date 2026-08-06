/**
 * The single seam between live requests and seeded demo data.
 *
 * Every resource method calls `call`, passing the value available in explicit
 * local demo mode. An absent or unreachable production API always follows the
 * typed error path and never returns fixtures.
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
