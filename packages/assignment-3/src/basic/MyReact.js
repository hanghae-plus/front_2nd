import { createHooks } from "./hooks";
import { createElement, render as updateElement } from "./render";

function MyReact() {
  const globalState = new Map();
  const stateIndex = 0;
  let reactRoot;
  let reactRootComponent;

  const _render = () => {
    return [globalState, stateIndex, reactRoot, reactRootComponent];
  };
  function render($root, rootComponent) {
    reactRoot = $root;
    reactRootComponent = rootComponent;

    const newNode = createElement(rootComponent());

    updateElement($root, newNode);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
