import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const _render = () => {};
  function render($root, rootComponent) {
    const { type, prop: props } = rootComponent();

    //자식 노드 요소 만들기
    const node = document.createElement(type);

    // children의 속성을 순회하면서 넣기
    for (let key in props) {
      const attribute = props[key];

      // children이 string일 때 그대로 text넣기
      if (key === "children" && typeof attribute === "string") {
        //innerText로 했을때 예상대로 동작을 하지 않음.
        node.textContent = attribute;
        continue;
      } else {
        node.setAttribute(key, attribute);
      }
    }

    //상위 노드에 삽입하기
    $root.appendChild(node);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
