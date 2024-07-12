import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  // 현재 렌더링 중인 DOM요소 저장
  let currentRoot = null;
  // 루트 컴포넌트 함수 저장
  let rootComponent = null;

  // 실제 DOM을 업데이트하는 역할
  // 현재 렌더링 중인 DOM 요소와 루트 컴포넌트를 사용하여 vDOM 생성 실제 돔에 반영
  const _render = () => {
    if (currentRoot && rootComponent) {
      // 매 렌더링마다 훅의 상태 인덱스 초기화
      resetHookContext();

      const vDom = rootComponent();
      // 렌더링 결과 _vDom에 저장
      updateElement(currentRoot, vDom, currentRoot._vDom);
      currentRoot._vDom = vDom;
    }
  };

  // 사용자가 호출하는 진입점
  function render($root, component) {
    currentRoot = $root;
    rootComponent = component;
    _render();
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
