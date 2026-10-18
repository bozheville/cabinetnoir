import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Unit tests for the pure analysis and identification engines. Node
// environment: none of the tested code touches the DOM. The tsconfig
// `baseUrl: src` aliases (@encryptors/..., @learning/...) resolve through
// vite-tsconfig-paths, the same way Next.js resolves them.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
