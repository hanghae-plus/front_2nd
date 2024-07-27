module.exports = {
  "env": {
    "browser": true,           // 브라우저 환경에서 실행되는 코드
    "node": true,              // Node.js 환경에서 실행되는 코드
    "es2021": true             // 최신 ECMAScript 기능 사용
  },
  "extends": [
    "eslint:recommended",      // ESLint에서 권장하는 기본 설정
    "plugin:@typescript-eslint/recommended", // TypeScript ESLint 권장 설정
    "plugin:react/recommended" // React에 대한 권장 설정
  ],
  "parser": "@typescript-eslint/parser", // TypeScript 파서 사용
  "parserOptions": {
    "ecmaVersion": 12,         // ECMAScript 2021 사용
    "sourceType": "module",    // ES6 모듈 사용
    "ecmaFeatures": {
      "jsx": true              // JSX 구문 사용
    }
  },
  "rules": {
    "semi": ["error", "always"],            // 세미콜론 강제 (세미콜론이 없으면 오류)
    "quotes": ["error", "single"],          // 문자열을 single quotes로 강제 (다른 인용 부호 사용 시 오류)
    "indent": ["error", 2],                 // 들여쓰기를 2칸으로 강제 (들여쓰기 2칸이 아니면 오류)
		"no-console": "off",                     // console 사용 경고 off ['off', 'warn', 'error']
    "linebreak-style": ["error", "unix"],   // 줄바꿈 스타일을 Unix로 강제 (Windows 줄바꿈 시 오류)
	  "no-unused-vars": "warn",                 // 사용되지 않는 변수 경고    
	  "no-multiple-empty-lines": ["error", { "max": 2 }], // 최대 2개의 연속 빈 줄만 허용
    "eqeqeq": ["error", "always"],            // 반드시 ===와 !== 사용 (==와 != 사용 금지)
    "curly": ["error", "all"],                // 모든 제어문에 중괄호 사용 강제
    "no-trailing-spaces": "error",             // 라인 끝에 불필요한 공백 금지
     
    "react/jsx-uses-react": "error",          // React 변수가 JSX에서 사용되었음을 ESLint에 알림 (사용되지 않으면 오류)
    "react/jsx-uses-vars": "error",           // JSX에서 사용되는 모든 변수가 정의되어 있음을 보장 (정의되지 않으면 오류)
    "react/jsx-indent": ["error", 2],         // JSX 들여쓰기를 2칸으로 강제
    "react/jsx-key": "error",                 // 반복문 내에서 JSX 요소에 key 속성 필요
    "react/jsx-no-duplicate-props": "error",  // JSX에서 중복된 속성 금지
    "react/jsx-no-target-blank": "error",     // target="_blank" 사용 시 rel="noopener noreferrer" 필요
    "react/jsx-props-no-spreading": "off",    // JSX 속성 스프레드 허용
    "react/react-in-jsx-scope": "off",        // React 17 이상에서는 필요 없음 (React를 전역에서 가져오지 않음)
    "react/prop-types": "off",                // prop-types 사용 비활성화 (TypeScript로 대체 가능)
    "react/jsx-filename-extension": ["warn", { "extensions": [".jsx", ".tsx"] }], // JSX 파일 확장자 설정
    "react/self-closing-comp": "error",       // 내용이 없는 컴포넌트는 자동으로 닫기
    "react/no-array-index-key": "warn",       // 배열 인덱스를 key로 사용하는 것 경고
    "react/prefer-stateless-function": "warn", // 상태가 없는 함수형 컴포넌트 권장

		"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // 사용되지 않는 변수 경고, _로 시작하는 인수는 무시
    "@typescript-eslint/no-explicit-any": "warn", // any 타입 사용 경고
    "@typescript-eslint/explicit-function-return-type": "off", // 함수 반환 타입 명시 비활성화
    "@typescript-eslint/explicit-module-boundary-types": "off", // 모듈 경계의 반환 타입 명시 비활성화
    "@typescript-eslint/no-inferrable-types": "warn", // 추론 가능한 타입 명시 금지
    "@typescript-eslint/no-empty-function": "warn", // 빈 함수 경고
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // 일관된 타입 정의 사용 강제 (interface)
    "@typescript-eslint/ban-ts-comment": "warn", // @ts-<directive> 사용 경고
    "@typescript-eslint/no-non-null-assertion": "warn", // Non-null 단언 연산자 경고
    "@typescript-eslint/prefer-optional-chain": "warn", // Optional chaining 사용 권장
    "@typescript-eslint/no-var-requires": "error", // require() 사용 금지
    "@typescript-eslint/prefer-as-const": "warn", // 리터럴 타입 단언에 as const 사용 권장
    "@typescript-eslint/no-unused-expressions": "error", // 사용되지 않는 표현식 금지
    
    //TypeScript와 React 관련 규칙
    "react/jsx-filename-extension": ["warn", { "extensions": [".jsx", ".tsx"] }], // JSX 파일 확장자 설정
    "react/prop-types": "off",                // prop-types 사용 비활성화 (TypeScript로 대체 가능)
    "@typescript-eslint/explicit-module-boundary-types": "off", // 모듈 경계의 반환 타입 명시 비활성화
    "react/jsx-uses-react": "off",            // React 17 이상에서는 필요 없음 (React를 전역에서 가져오지 않음)
    "react/react-in-jsx-scope": "off"         // React 17 이상에서는 필요 없음 (React를 전역에서 가져오지 않음)

  },
  "plugins": [
    "react",                  // React 관련 플러그인 활성화
    "@typescript-eslint"           // TypeScript ESLint 플러그인 활성화
  ],
  "settings": {
    "react": {
      "version": "detect"              // 설치된 React 버전을 자동으로 감지
    }
  },
  "globals": {
    "Atomics": "readonly",   // Atomics 전역 변수를 읽기 전용으로 설정
    "SharedArrayBuffer": "readonly"  // SharedArrayBuffer 전역 변수를 읽기 전용으로 설정
  }
}

