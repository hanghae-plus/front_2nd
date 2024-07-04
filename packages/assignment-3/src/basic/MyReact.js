import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let renderComponent = null;
  let oldNode = null;
  let root = null;

  const _render = () => {
    if (!root || !renderComponent) return;
    // hook의 실행 순서에 따라 값을 참조하기 때문에 내부 참조 id를 초기화한다.
    resetHookContext();

    // 새로운 노드를 렌더링한다.
    const newNode = renderComponent();

    // 새로운 노드를 기존 노드와 비교하여 업데이트한다.
    updateElement(root, newNode, oldNode);

    // 새로은 노드를 oldNode에 저장하여 다음 렌더링 시 비교할 수 있도록 한다.
    oldNode = newNode;
  };

  function render($root, component) {
    // 새로운 노드를 렌더링하기 전에 기존 노드를 초기화한다.
    oldNode = null;
    // 루트 노드와 컴포넌트를 저장한다.
    root = $root;
    // 컴포넌트를 저장한다.
    renderComponent = component;
    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
