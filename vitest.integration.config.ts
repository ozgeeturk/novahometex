import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
    globalSetup: ['./tests/integration/global-setup.mjs'],
    setupFiles: ['./tests/integration/setup.ts'],
    fileParallelism: false,
    testTimeout: 20000,
  },
});
