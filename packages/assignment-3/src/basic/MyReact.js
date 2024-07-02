import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRoot = null; // 현재 화면을 그릴 위치
  let currentComponent = null; // 현재 화면에 표시할 내용

  // 화면을 실제로 업데이트하는 작업을 담당 (화면을 다시 그리는 작업 관리 위해)
  const _render = () => {
    if (currentRoot && currentComponent) {
      resetHookContext(); // 훅 초기화
      const newVNode = currentComponent();
      // 업데이트 해야하므로 기존 내용초기화(모든 HTML 요소를 없앰)
      // 초기화하지 않으면 내용 섞일 수 있음
      currentRoot.innerHTML = "";
      updateElement(currentRoot, newVNode); // 업데이트
    }
  };

  // 초기 렌더링과 설정 작업을 담당
  // render()안에 _render() 내용을 그냥 넣지 않는이유: render() 함수 전체가 다시 실행되므로 비효율적
  function render($root, rootComponent) {
    currentRoot = $root; // 렌더링 할 위치 받아옴
    currentComponent = rootComponent; //렌더링 할 내용 받아옴
    _render(); // 렌더링 하기
  }

  //만든 함수들 사용
  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
