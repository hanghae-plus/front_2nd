import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

const util = require("util");

const checkDepth = (obj) => {
  console.log(util.inspect(obj, false, null, true));
};

function MyReact() {
  let defaultRoot;
  let memorizedRoot;
  let oldNode;
  let newNode;

  //useState에서 setState의 callback으로 넘겨야함
  const _render = () => {
    resetHookContext();

    if (!oldNode || !newNode) {
      return;
    }

    const node = newNode();

    updateElement(defaultRoot, node, oldNode);
    oldNode = node;
  };
  function render($root, rootComponent) {
    resetHookContext();

    newNode = rootComponent;
    defaultRoot = $root;
    if (memorizedRoot === undefined) {
      memorizedRoot = $root;
    }

    const node = newNode();

    updateElement($root, node);

    oldNode = node;
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
