const { defineConfig } = require("cypress"); // commonJS 로 바꿈

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
  },
});
