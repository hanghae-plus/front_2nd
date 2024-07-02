import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRootNode;
  let currentComponentNode;
  let oldNode;

  const _render = () => {
    if (currentComponentNode && currentRootNode) {
      resetHookContext();
      const newNode = currentComponentNode();
      updateElement(currentRootNode, newNode, oldNode);
      oldNode = newNode;
    }
  };
  function render($root, rootComponent) {
    currentRootNode = $root;
    currentComponentNode = rootComponent;
    resetHookContext();

    const newNode = rootComponent();
    updateElement(currentRootNode, newNode);
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
