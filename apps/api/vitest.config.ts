import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // esbuild silently ignores `emitDecoratorMetadata`, so Nest's DI cannot read the
  // design time parameter types and every by-type injection fails to resolve. SWC
  // emits the metadata, which is why the suite is transformed with it rather than
  // with vitest's default esbuild pipeline.
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'es2023',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        keepClassNames: true,
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: false,
    restoreMocks: true,
    // Nothing in this suite may open a socket to anything but the in-process
    // supertest listener. See README.md, "Testing".
    setupFiles: ['./src/testing/setup.ts'],
  },
});
