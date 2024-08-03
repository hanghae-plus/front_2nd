import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname, 'src/basic'),
    build: {
      outDir: path.resolve(__dirname, 'dist/basic'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/basic'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'setupTests.ts',
      coverage: {
        reportsDirectory: './.coverage',
        reporter: ['lcov', 'json', 'json-summary'],
      },
    },
  })
);
