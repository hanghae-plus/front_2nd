import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const renderVal = {
    rootEl: null,
    rootComponent: null,
    currentEl: null,
    beforeEl: null,
  }

  // 세팅된 renderVal 값 기반의 Component생성
  const _render = () => {
    const currentNode = renderVal.rootComponent();

    updateElement(renderVal.rootEl, currentNode, renderVal.currentEl);
    resetContext(); // 기존 Hook에 저장되어있던 값을 reset

    renderVal.beforeEl = renderVal.currentEl;
    renderVal.currentEl = currentNode;
  };

  // 랜더링을 위한 renderVal 값 세팅
  function render($root, rootComponent) {
    renderVal.rootEl = $root;
    renderVal.rootComponent = rootComponent;
    renderVal.currentEl = null;
    renderVal.beforeEl = null;
    _render();
  }

  const { useState, useMemo, resetContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
