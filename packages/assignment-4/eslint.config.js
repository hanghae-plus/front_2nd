import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"], // 적용할 파일 확장자 설정
    plugins: {
      prettier,
    },
    rules: {
      ...configPrettier.rules, // prettier의 규칙을 적용하여 eslint 규칙과 충돌하지 않도록 설정
      "prettier/prettier": "error", // prettier 규칙을 위반할 경우 에러로 표시
    },
  },
];
