import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let _root = null;
  let _rootComponent = null;

  const _render = () => {
    if (_root && _rootComponent) {
      resetHookContext();
      const oldVNode = _root._vNode || null;
      const newVNode = _rootComponent();
      updateElement(_root, newVNode, oldVNode);
      _root._vNode = newVNode; // Save the newVNode for future comparisons
    }
  };
  function render($root, rootComponent) {
    _root = $root;
    _rootComponent = rootComponent;
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
