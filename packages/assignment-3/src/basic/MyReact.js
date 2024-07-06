import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  // 상태가 변경되어도 동일한 root, rootcomponent 사용하기 위해 선언
  let _root = null;
  let _rootComponent = null;

  const _render = () => {
    //setState가 렌더시켜줄 callback 함수
    resetHookContext(); // hooks 사용 시 일관성 있게 초기화

    const newNode = _rootComponent();
    //oldNode를 전달해줌으 렌더링 최적화 진행
    updateElement(_root, newNode, _root.children[0]); // oldNode를 명시적으로 전달
  };

  function render($root, rootComponent) {
    //초기 렌더링시 세팅
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
