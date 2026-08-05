import { aiUnavailableError } from '../errors';
import type { AiProviderAdapter } from '../types';

/**
 * The adapter used when no credentials are configured.
 *
 * It reports `available: false`, which makes the gateway report `disabled`, so
 * every AI feature degrades to a truthful "assistance is not configured" state.
 * Calling it anyway is a programming error and raises immediately.
 */
export function createDisabledProvider(model = 'unconfigured'): AiProviderAdapter {
  return {
    name: 'disabled',
    model,
    available: false,
    async complete() {
      throw aiUnavailableError('not_configured');
    },
    // eslint-disable-next-line require-yield -- there is nothing to stream.
    async *stream() {
      throw aiUnavailableError('not_configured');
    },
  };
}
