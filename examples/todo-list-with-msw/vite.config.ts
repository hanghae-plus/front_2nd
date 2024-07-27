import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
