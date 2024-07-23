import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import {
  defineConfig as defineTestConfig,
  mergeConfig,
  UserConfig as VitestUserConfig,
} from 'vitest/config';

const viteConfig: UserConfig = {
  plugins: [react()],
};

const vitestConfig: VitestUserConfig = {
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
};

export default mergeConfig(
  defineConfig(viteConfig),
  defineTestConfig(vitestConfig)
);
