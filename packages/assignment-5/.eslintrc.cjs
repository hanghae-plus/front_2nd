module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ['import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '__tests__', 'origin'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      },
    ],
  },
};
