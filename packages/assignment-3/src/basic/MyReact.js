import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  // 루트 요소와 루트 컴포넌트 함수를 저장할 변수
  let rootElement = null;
  let rootComponentFn = null;

  // 훅 컨텍스트 초기화 및 재렌더링 함수
  function resetAndRender() {
    // 훅 상태 초기화
    resetHookContext();
    // 기존 DOM 내용 제거
    rootElement.innerHTML = "";
    // 애플리케이션 다시 렌더링
    renderApp(rootElement, rootComponentFn);
  }

  // 훅 시스템 초기화
  // createHooks에 resetAndRender를 콜백으로 전달하여 상태 변경 시 리렌더링 트리거
  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(resetAndRender);

  // 애플리케이션 렌더링 함수
  function renderApp($root, componentFn) {
    // 훅 상태 초기화 (새로운 렌더 사이클 시작)
    resetHookContext();
    // 루트 요소와 컴포넌트 함수 저장 (나중의 리렌더링을 위해)
    rootElement = $root;
    rootComponentFn = componentFn;
    // 컴포넌트 함수 실행하여 가상 DOM 생성
    const vdom = componentFn();
    // 가상 DOM을 실제 DOM에 반영
    updateElement($root, vdom);
  }

  // 공개 API: render 함수와 훅 함수들 노출
  return {
    render: renderApp,
    useState,
    useMemo,
  };
}

// MyReact 인스턴스 생성 및 내보내기
export default MyReact();
