import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

// MyReact 함수는 커스텀 React-like 라이브러리를 생성
function MyReact() {
  // _root는 렌더링할 루트 DOM 요소를 저장
  // _rootComponent는 루트 컴포넌트 함수를 저장
  let _root = null;
  let _rootComponent = null; 

  // _render 함수는 실제로 컴포넌트를 렌더링
  const _render = () => { 
    // 훅 컨텍스트를 초기화
    resetHookContext();
    // 루트 컴포넌트를 호출하여 요소를 생성
    const element = _rootComponent();
    // 루트 요소를 업데이트
    updateElement(_root, element, _root.children[0]); 
  };

  // render 함수는 루트 DOM 요소와 루트 컴포넌트를 설정하고 렌더링을 시작
  function render($root, rootComponent) {
    _root = $root;
    _rootComponent = rootComponent;
    _render();
  }

  // createHooks 함수로부터 useState, useMemo, resetContext를 가져옴
  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  // render, useState, useMemo 함수를 반환
  return { render, useState, useMemo };
}
 
export default MyReact();
