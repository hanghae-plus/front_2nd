// vite.config.ts
import { defineConfig as defineTestConfig, mergeConfig } from "file:///C:/Users/user/Desktop/front_2nd/node_modules/.pnpm/vitest@2.0.2_@types+node@20.14.10_@vitest+ui@1.6.0_jsdom@24.0.0/node_modules/vitest/dist/config.js";
import { defineConfig } from "file:///C:/Users/user/Desktop/front_2nd/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10/node_modules/vite/dist/node/index.js";
import path from "path";
import react from "file:///C:/Users/user/Desktop/front_2nd/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.3.3_@types+node@20.14.10_/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "~app": path.resolve("./src/fsd/app"),
        "~entities": path.resolve("./src/fsd/entities"),
        "~features": path.resolve("./src/fsd/features"),
        "~pages": path.resolve("./src/fsd/pages"),
        "~shared": path.resolve("./src/fsd/shared")
      }
    }
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts"
    }
  })
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcZnJvbnRfMm5kXFxcXHBhY2thZ2VzXFxcXGFzc2lnbm1lbnQtNVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdXNlclxcXFxEZXNrdG9wXFxcXGZyb250XzJuZFxcXFxwYWNrYWdlc1xcXFxhc3NpZ25tZW50LTVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvRGVza3RvcC9mcm9udF8ybmQvcGFja2FnZXMvYXNzaWdubWVudC01L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIGFzIGRlZmluZVRlc3RDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcclxuICBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICd+YXBwJzogcGF0aC5yZXNvbHZlKCcuL3NyYy9mc2QvYXBwJyksXHJcbiAgICAgICAgJ35lbnRpdGllcyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvZnNkL2VudGl0aWVzJyksXHJcbiAgICAgICAgJ35mZWF0dXJlcyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvZnNkL2ZlYXR1cmVzJyksXHJcbiAgICAgICAgJ35wYWdlcyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvZnNkL3BhZ2VzJyksXHJcbiAgICAgICAgJ35zaGFyZWQnOiBwYXRoLnJlc29sdmUoJy4vc3JjL2ZzZC9zaGFyZWQnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSksXHJcbiAgZGVmaW5lVGVzdENvbmZpZyh7XHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICBzZXR1cEZpbGVzOiAnLi9zcmMvc2V0dXBUZXN0cy50cycsXHJcbiAgICB9LFxyXG4gIH0pXHJcbik7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyxnQkFBZ0Isa0JBQWtCLG1CQUFtQjtBQUM3WixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVE7QUFBQSxFQUNiLGFBQWE7QUFBQSxJQUNYLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxRQUFRLEtBQUssUUFBUSxlQUFlO0FBQUEsUUFDcEMsYUFBYSxLQUFLLFFBQVEsb0JBQW9CO0FBQUEsUUFDOUMsYUFBYSxLQUFLLFFBQVEsb0JBQW9CO0FBQUEsUUFDOUMsVUFBVSxLQUFLLFFBQVEsaUJBQWlCO0FBQUEsUUFDeEMsV0FBVyxLQUFLLFFBQVEsa0JBQWtCO0FBQUEsTUFDNUM7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQUEsRUFDRCxpQkFBaUI7QUFBQSxJQUNmLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
