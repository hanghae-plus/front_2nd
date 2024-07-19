import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        refactoring: path.resolve(__dirname, "src/refactoring"),
        cart: path.resolve(__dirname, "src/refactoring/components/cart"),
        hooks: path.resolve(__dirname, "src/refactoring/hooks"),
        types: path.resolve(__dirname, "src/types.ts"),
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  }),
);
