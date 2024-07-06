import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let component = null;
  let oldNode = null;
  let root = null;

  const _render = () => {
    resetHookContext();
    const newNode = component();
    updateElement(root, newNode, oldNode);
    oldNode = newNode;
  };

  function render($root, rootComponent) {
    oldNode = null;
    root = $root;
    component = rootComponent;

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
