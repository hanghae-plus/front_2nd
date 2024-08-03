const { beforeEach } = require('vitest');
const { beforeAll } = require('vitest');
const { afterAll } = require('vitest');
const { afterEach } = require('vitest');
const { expect } = require('vitest');
const { describe } = require('vitest');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  global: {
    globalThis: true,
    describe: true,
    it: true,
    expect: true,
    beforeEach: true,
    afterEach: true,
    beforeAll: true,
    afterAll: true,
    vi: true,
  },
};
