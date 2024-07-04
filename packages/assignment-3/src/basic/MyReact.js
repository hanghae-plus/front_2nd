import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let _root = null;
  let _rootComponent = null;
  // let isRendering = false;

  const _render = () => {
    // if (isRendering) return;
    // isRendering = true;
    resetHookContext();
    const element = _rootComponent();
    updateElement(_root, element, _root.children[0]);
    // isRendering = false;
  };
  function render($root, rootComponent) {
    _root = $root;
    _rootComponent = rootComponent;
    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
