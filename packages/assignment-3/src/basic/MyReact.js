import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRoot = null;
  let currentComponent = null;
  let oldComponent = null;

  const _render = () => {
    resetHookContext();
    const newElement = currentComponent();
    updateElement(currentRoot, newElement, oldComponent);
    oldComponent = newElement;
  };

  function render($root, rootComponent) {
    resetHookContext();
    currentRoot = $root;
    currentComponent = rootComponent;
    const newElement = currentComponent();
    updateElement(currentRoot, newElement);
    oldComponent = newElement;
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
