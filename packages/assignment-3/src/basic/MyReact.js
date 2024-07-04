import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let renderComponent = null;
  let oldNode = null;
  let root = null;

  const _render = () => {
    if (!root || !renderComponent) return;
    resetHookContext();

    const newNode = renderComponent();

    updateElement(root, newNode, oldNode);

    oldNode = newNode;
  };

  function render($root, component) {
    oldNode = null;
    root = $root;
    renderComponent = component;
    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
