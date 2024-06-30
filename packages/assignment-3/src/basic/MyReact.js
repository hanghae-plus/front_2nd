import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const _render = () => {};
  function render($root, rootComponent) {
    const { type, prop } = rootComponent();

    //자식 노드 요소 만들기
    const node = document.createElement(type);
    const children = prop.children;

    // if (prop) {
    //   for (const key in prop) {
    //     node.setAttribute(key, prop[key]);
    //   }
    // }

    if (children) {
      if (typeof children === "string") {
        node.textContent = children;
      }
    }

    // children이 문자열이면 텍스트 노드로 추가
    // if (typeof children === 'string') {
    //   node.textContent = children;
    // }

    // // 자식 요소가 배열이면 각각의 요소를 추가 (optional)
    // if (Array.isArray(children)) {
    //   children.forEach(child => {
    //     if (typeof child === 'string') {
    //       element.appendChild(document.createTextNode(child));
    //     } else {
    //       element.appendChild(child);
    //     }
    //   });
    // }

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
