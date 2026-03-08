import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['template/test/**/*.test.js'],
    globals: true,
  },
});
