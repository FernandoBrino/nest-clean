import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.e2e.spec.ts'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});