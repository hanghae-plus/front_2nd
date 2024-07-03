import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRoot = null;
  let currentComponent = null;

  const render = ($root, rootComponent) => {
    resetHookContext();
    currentRoot = $root;
    currentComponent = rootComponent;
    const element = rootComponent();
    updateElement($root, element);
  };

  const reRender = () => {
    resetHookContext();
    currentRoot.innerHTML = "";
    render(currentRoot, currentComponent);
  };

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(reRender);

  return { render, useState, useMemo };
}

export default MyReact();
