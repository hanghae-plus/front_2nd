import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let rootNode;
  let newNode;
  let oldNode = null;

  const _render = () => {
    if (newNode && rootNode) {
      resetHookContext();

      const addNewNode = newNode();
      updateElement(rootNode, addNewNode, oldNode);
      oldNode = newNode;
    }
  };

  function render($root, rootComponent) {
    rootNode = $root;
    newNode = rootComponent;
    resetHookContext();

    const addNewNode = newNode();
    updateElement(rootNode, addNewNode);
    oldNode = newNode;
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
