import { defineConfig } from 'tsup';

import { nodeAppBundle } from '../../tsup.base';

/** The short-link redirect service, bundled to `dist/main.mjs`. */
export default defineConfig(nodeAppBundle('src/start.ts'));
