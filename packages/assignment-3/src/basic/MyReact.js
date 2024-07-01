import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let rootNode;
  let currentNode;
  let prevNode = null;

  const _render = () => {
    if (currentNode && rootNode) {
      resetHookContext();
      const newNode = currentNode();
      updateElement(rootNode, newNode, prevNode);
      prevNode = newNode;
    }
  };

  function render($root, rootComponent) {
    rootNode = $root;
    currentNode = rootComponent;
    resetHookContext();

    const newNode = currentNode();
    updateElement(rootNode, newNode);
    prevNode = newNode;
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
