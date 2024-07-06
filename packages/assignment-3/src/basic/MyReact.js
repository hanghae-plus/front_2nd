import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let _rootElement = null;
  let _currentComponent = null;
  let _oldNode = null;

  function _render() {
    if (!_rootElement || !_currentComponent) return;

    resetHookContext();

    const _newNode = _currentComponent();

    updateElement(_rootElement, _newNode, _oldNode);

    _oldNode = _newNode;
  }

  function render($root, currentComponent) {
    _rootElement = $root;
    _currentComponent = currentComponent;
    _oldNode = null;

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
