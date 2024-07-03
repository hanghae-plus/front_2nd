import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  const _render = () => {};

  /**
   * 리액트 렌더 함수
   *
   * @param {*} $root 요소를 넣을 상위 노드
   * @param {Function} rootComponent 요소 반환 함수
   */
  function render($root, rootComponent) {
    const component = rootComponent();
    updateElement($root, component);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
