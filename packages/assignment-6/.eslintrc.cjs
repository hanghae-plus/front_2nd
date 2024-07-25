module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "react-refresh": require("eslint-plugin-react-refresh"),
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // 다른 규칙을 추가할 수 있습니다.
    },
    processor: "@typescript-eslint/parser",
  },
];
