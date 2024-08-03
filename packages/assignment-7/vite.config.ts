import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '~app': path.resolve('src/app'),
        '~pages': path.resolve('src/pages'),
        '~widgets': path.resolve('src/widgets'),
        '~features': path.resolve('src/features'),
        '~entities': path.resolve('src/entities'),
        '~shared': path.resolve('src/shared'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        reportsDirectory: './.coverage',
        reporter: ['lcov', 'json', 'json-summary'],
      },
    },
  }),
);
