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
  plugins: ['react-refresh', 'testing-library', 'jest-dom'],
  rules: {
    'fsd-import/fsd-relative-path': ['error', { alias: '~' }],
    'fsd-import/public-api-imports': 'error',
    'fsd-import/layer-imports': 'error',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    curly: ['error'],
    eqeqeq: ['error', 'always'],
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-var': ['error'],
    'no-trailing-spaces': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // eslin-plugin-testing-library
    'testing-library/await-async-queries': 'error',
    'testing-library/no-await-sync-queries': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'off',

    // eslint-plugin-jest-dom
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
  },
  globals: {
    describe: true,
  },
};
