import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let _root = null;
  let _rootComponent = null;

  /**
   * 리액트 내부 렌더 함수
   */
  const _render = () => {
    // 1) hooks 사용 시 일관성 있게 사용할 수 있도록 (인덱스를) 초기화 하는 작업이 필요
    resetHookContext();

    // 2) 렌더링
    const newNode = _rootComponent();
    // oldNode를 넣어주지 않으면 children에 계속 추가 됨..
    updateElement(_root, newNode, _root.children[0]);
  };

  /**
   * 리액트 렌더 함수
   *
   * @param {*} $root 컴포넌트를 넣을 상위 노드
   * @param {Function} rootComponent 컴포넌트
   */
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
