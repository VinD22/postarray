import { defineConfig } from 'tsup';

import { nodeAppBundle } from '../../tsup.base';

/**
 * The Temporal worker, bundled to `dist/main.mjs`.
 *
 * The workflow bundle is built separately by `scripts/build-workflow-bundle.mjs`
 * and lands at `dist/workflow-bundle.js`. It cannot come from here: workflow
 * code runs inside Temporal's deterministic sandbox and has to be produced by
 * the SDK's own bundler, which pins the workflow runtime and refuses a module
 * that reaches for the outside world.
 */
export default defineConfig(nodeAppBundle('src/main.ts'));
