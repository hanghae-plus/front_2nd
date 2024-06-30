import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRoot = null;
  let currentComponent = null;

  const render = ($root, rootComponent) => {
    currentRoot = $root;
    currentComponent = rootComponent;
    const element = rootComponent();
    updateElement($root, element);
  };

  const reRender = () => {
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
