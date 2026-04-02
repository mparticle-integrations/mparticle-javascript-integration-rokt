/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'src/Rokt-Kit.ts'),
      name: 'RoktKit',
      formats: ['iife', 'cjs'],
      fileName: (format) => `Rokt-Kit.${format === 'iife' ? 'iife' : 'common'}.js`,
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    include: ['test/src/**/*.spec.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
