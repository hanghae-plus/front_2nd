import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let rootElement = null;
  let rootComponent = null;

  const _render = () => {
    resetHookContext();

    if (rootElement && rootComponent) {
      const newVNode = rootComponent();
      updateElement(rootElement, newVNode, rootElement._oldVNode || null);
      rootElement._oldVNode = newVNode;
    }
  };

  function render($root, rootComponentFn) {
    rootElement = $root;
    rootComponent = rootComponentFn;
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
