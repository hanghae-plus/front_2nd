import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let root = null;
  let rootComponent = null;

  const _render = () => {
    if (!root || !rootComponent) return;
    resetHookContext();

    root.innerHTML = '';

    const newComponent = rootComponent();

    updateElement(root, newComponent);
  };

  function render($root, component) {
    root = $root;
    rootComponent = component;
    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
