import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'es2023',
    // Nest's DI reads design-time parameter types from decorator metadata.
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      },
    },
  },
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
