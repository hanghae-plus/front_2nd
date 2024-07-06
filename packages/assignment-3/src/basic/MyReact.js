import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  // $container: 최상위 컴포넌트(rootComponent)가 mount되는 root HTML Element
  // renderer: rootComponent를 반환하는 함수
  // currentNode: 현재 상태를 반영한 React Element
  // workInProgressNode: 업데이트된 상태를 반영한 React Element
  let $container, renderer, currentNode, workInProgressNode;

  // 최초 렌더링 시 MyReact 스코프 내의 전역변수들을 초기화
  const initReact = () => {
    currentNode = undefined;
    resetHookContext();
    resetValues();
  }

  // diff 알고리즘을 기반으로 render + commit을 수행하고 currentNode를 workInProgressNode로 업데이트
  const applydiff = () => {
    // 업데이트된 state를 기준으로 새로운 React Element 생성
    workInProgressNode = renderer();
    updateElement($container, workInProgressNode, currentNode);
    currentNode = workInProgressNode;
  }

  const _render = () => {
    // 리렌더링이 일어나기 직전에 올바른 state, memo를 참조하도록 resetContext 실행
    resetHookContext();
    applydiff();
  };

  function render($root, rootComponent) {
    $container = $root;
    renderer = rootComponent;
    initReact();
    applydiff();
  }

  const { useState, useMemo, resetContext: resetHookContext, resetValues } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
