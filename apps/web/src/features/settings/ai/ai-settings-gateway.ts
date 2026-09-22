import { call } from '@/lib/api/call';
import { newIdempotencyKey } from '@/lib/api';

/**
 * The AI settings boundary.
 *
 * Mirrors `GET` and `PUT /v1/ai/settings`, which are served by the same
 * `mediaAnalysis` use case the MCP server and the CLI reach. Demo mode shows
 * the real default: image analysis off.
 */
export interface AiSettingsView {
  readonly imageAnalysisEnabled: boolean;
  readonly canChange: boolean;
}

const DEMO: AiSettingsView = { imageAnalysisEnabled: false, canChange: true };

export const aiSettingsGateway = {
  get(): Promise<AiSettingsView> {
    return call<AiSettingsView>('/v1/ai/settings', { method: 'GET' }, () => DEMO);
  },
  update(input: { readonly imageAnalysisEnabled: boolean }): Promise<AiSettingsView> {
    return call<AiSettingsView>(
      '/v1/ai/settings',
      { method: 'PUT', body: input, idempotencyKey: newIdempotencyKey('settings') },
      () => ({ ...DEMO, imageAnalysisEnabled: input.imageAnalysisEnabled }),
    );
  },
};
