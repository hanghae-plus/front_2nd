import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let renderCount = 0;
  const components = {
    root: null,
    rootComponent: null,
    oldNode: null,
  }

  const _render = () => {
    resetHookContext();

    const {root, rootComponent} = components;
    const newNode = rootComponent();

    if(renderCount > 0) {
      updateElement(root, newNode, components.oldNode);
    } else {
      updateElement(root, newNode);
    }

    components.oldNode = newNode;
    renderCount++;
  }

  function render($root, rootComponent) {
    renderCount = 0;
    components.root = $root;
    components.rootComponent = rootComponent;
    components.oldNode = rootComponent();

    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
