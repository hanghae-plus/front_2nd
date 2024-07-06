import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const obj = {
    root: null,
    rootComponent: null,
    old: null,
    new: null,
  };

  const _render = () => {
    resetHookContext();
    obj.new = obj.rootComponent();
    updateElement(obj.root, obj.new, obj.old);
    obj.old = obj.new;
  };

  const resetContext = () => {
    obj.root = null;
    obj.rootComponent = null;
    obj.old = null;
    obj.new = null;
  };

  function render($root, rootComponent) {
    resetContext();
    obj.root = $root;
    obj.rootComponent = rootComponent;

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
