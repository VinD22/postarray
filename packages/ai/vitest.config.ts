import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: false,
    // Nothing in this package may reach the network. The DeepSeek adapter is
    // always exercised through an injected fetch double.
    testTimeout: 10_000,
  },
});
