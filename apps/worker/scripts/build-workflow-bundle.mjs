import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { bundleWorkflowCode } from '@temporalio/worker';

/**
 * Pre-builds the Temporal workflow bundle.
 *
 * Without this the worker bundles `src/workflows/index.ts` on every boot, which
 * means the runtime image has to carry the workflow sources and a TypeScript
 * toolchain, and every cold start pays for a webpack run before the first task
 * is polled. `src/workflows/index.ts` is already an isolated entry point and the
 * core/shell split exists precisely so this is possible.
 *
 * The output is deliberately a sibling of `dist/main.mjs`: `startWorker` looks
 * for `dist/workflow-bundle.js` next to itself and prefers it when present, so
 * `pnpm dev` still bundles from source and a built image never does.
 */

const workflowsPath = fileURLToPath(new URL('../src/workflows/index.ts', import.meta.url));
const outDir = fileURLToPath(new URL('../dist/', import.meta.url));
const outFile = `${outDir}workflow-bundle.js`;

const { code } = await bundleWorkflowCode({ workflowsPath });

await mkdir(outDir, { recursive: true });
await writeFile(outFile, code, 'utf8');

process.stdout.write(`worker: workflow bundle written to ${outFile} (${code.length} bytes)\n`);
