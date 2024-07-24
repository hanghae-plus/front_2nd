import { createHooks } from "./hooks";
import { render as updateElement, createElement } from "./render";

function MyReact() {
  let renderRoot;
  let renderNode;
  let oldNode;

  function resetPrevTestVar() {
    renderRoot = undefined;
    renderNode = undefined;
    oldNode = undefined;
  }

  /**
   * setState에서 값이 변경될 때, 호출 될 콜백
   * 리렌더링이 일어날 때 마다 이전 노드는 지워주고 새 노드를 깔아줘야함.
   */
  const _render = () => {
    resetHookContext();
    const currNode = renderNode();

    !oldNode
      ? updateElement(renderRoot, currNode)
      : updateElement(renderRoot, currNode, oldNode);

    oldNode = currNode;
  };

  function render($root, rootComponent) {
    // 이전 테스트 변수 초기화
    resetPrevTestVar();

    renderRoot = $root;
    renderNode = rootComponent;

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
