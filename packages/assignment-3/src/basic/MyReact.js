import { createHooks } from "./hooks";
import { render as updateElement } from "./render";
import { isNull } from "./utils";

function MyReact() {
  let root, component;
  let newComponent = null;
  let oldComponent = null;

  const resetContext = () => {
    root = undefined;
    component = undefined;
    newComponent = null;
    oldComponent = null;
    resetHookContext();
  };

  const _render = () => {
    resetHookContext();

    newComponent = component();
    if (isNull(oldComponent)) {
      updateElement(root, newComponent);
    } else {
      updateElement(root, newComponent, oldComponent);
    }

    oldComponent = newComponent;
  };

  function render($root, rootComponent) {
    resetContext();
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
