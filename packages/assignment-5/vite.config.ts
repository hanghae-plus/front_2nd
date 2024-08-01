import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        refactoring: path.resolve(__dirname, "src/refactoring"),
        cart: path.resolve(__dirname, "src/refactoring/components/cart"),
        admin: path.resolve(__dirname, "src/refactoring/components/admin"),
        hooks: path.resolve(__dirname, "src/refactoring/hooks"),
        pages: path.resolve(__dirname, "src/refactoring/pages"),
        components: path.resolve(__dirname, "src/refactoring/components"),
        types: path.resolve(__dirname, "src/types.ts"),
        provider: path.resolve(
          __dirname,
          "src/refactoring/components/provider",
        ),
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
