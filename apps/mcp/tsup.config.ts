import { defineConfig } from 'tsup';

import { nodeAppBundle } from '../../tsup.base';

/** The remote MCP server, bundled to `dist/main.mjs`. */
export default defineConfig(nodeAppBundle('src/start.ts'));
