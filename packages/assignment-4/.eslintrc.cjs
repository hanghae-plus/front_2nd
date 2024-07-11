module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.test.js'],
  parser: '@typescript-eslint/parser',
  rules: {},
}
