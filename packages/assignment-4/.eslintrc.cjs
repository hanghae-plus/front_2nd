module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
    eqeqeq: "error",
    "prefer-const": "warn",
    "no-unused-vars": "warn",
    "no-var": "error",
    "no-console": "error",
    curly: "error",
  },
};
