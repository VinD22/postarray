import { defineConfig } from 'tsup';

import { nodeAppBundle } from '../../tsup.base';

/**
 * The Nest API, bundled to `dist/main.mjs`.
 *
 * `emitDecoratorMetadata` is on in this app's tsconfig, so tsup routes the
 * decorated files through SWC. Nest resolves most providers by constructor
 * parameter type, and esbuild alone cannot emit that metadata.
 */
export default defineConfig(nodeAppBundle('src/main.ts'));
