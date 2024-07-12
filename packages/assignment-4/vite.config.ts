import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config'
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react-swc'

export default mergeConfig(
  defineConfig({
    plugins: [react()],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
