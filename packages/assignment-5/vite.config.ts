import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '~app': path.resolve('./src/fsd/app'),
        '~entities': path.resolve('./src/fsd/entities'),
        '~features': path.resolve('./src/fsd/features'),
        '~pages': path.resolve('./src/fsd/pages'),
        '~shared': path.resolve('./src/fsd/shared'),
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  })
);
