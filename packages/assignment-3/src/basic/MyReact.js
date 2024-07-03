import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let _entryNode; //진입노드
  let _oldNode = null; //이전노드
  let _component; //관리중인 컴포넌트

  /**
   * @NOTE
   * hooks에서 setState를 호출할때 사용됨(리렌더링)
   * 관리중인 컴포넌트의 jsx를 다시 얻어서 리렌더링시킨다.
   */
  const _render = () => {
    render(_entryNode, () => {
      return _component();
    });
  };

  /**
   * @TODO
   * 관리중인 컴포넌트가 여러개라면?
   * @NOTE
   * 0. 진입 Root가 달라지면, _root, _old를 초기화
   * 1. 컴포넌트에서 같은 useState 사용하도록, Hook idx 초기화
   * 3. 변경된 컴포넌트의 jsx()를 newNode에 할당
   * 4. 리렌더링
   * 5. oldNode 갱신
   * @param {*} $root 진입 Root Node
   * @param {*} rootComponent 컴포넌트(관리대상)
   */
  function render($root, rootComponent) {
    if (_entryNode !== $root) {
      _entryNode = $root;
      _oldNode = null;
      _component = rootComponent;
    }
    resetHookContext();
    const newNode = rootComponent();
    updateElement($root, newNode, _oldNode);
    _oldNode = newNode;
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
