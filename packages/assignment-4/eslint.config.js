import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
];

// 모든 JS, TS, JSX, TSX 파일에 대해 ESLint 규칙 적용
// JSX 문법 지원 활성화
// 브라우저 환경의 전역 변수 허용
// @eslint/js의 권장 설정 적용
// TypeScript ESLint의 권장 설정 적용
// React ESLint 플러그인의 권장 설정을 최신 ESLint 형식에 맞게 변환하여 적용
