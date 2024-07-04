import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

/*
  render와 hooks를 결합하여 MyReact의 내용을 채워야합니다.
 */

function MyReact() {
  let elementNodes = {
    rootNode: null,
    newNode: null,
    oldNode: null,
  };

  const _render = () => {
    resetHookContext();

    const newComponent = elementNodes.newNode();
    const oldComponent = elementNodes.oldNode;

    updateElement(elementNodes.rootNode, newComponent, oldComponent);

    elementNodes.oldNode = elementNodes.newNode;
  };
  function render($root, rootComponent) {
    elementNodes = { rootNode: $root, newNode: rootComponent, oldNode: null };
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
