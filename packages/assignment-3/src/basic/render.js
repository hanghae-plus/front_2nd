import { deepEquals } from "../../../assignment-2/src/basic/basic.js";
/*
1. jsx 함수를 구현합니다. (dom 구조와 비슷한 객체를 만들어서 사용하기 위함)
2. createElement 함수를 구현합니다. (jsx를 dom으로 변환하는 함수)
3. render 함수를 구현합니다. (dom에 jsx를 diff 알고리즘으로 반영하는 함수)
4. render함수는 다음과 같이 동작합니다.
    1. 최초 렌더링시에 newNode(jsx)를 받아와서 dom으로 변환합니다. (diff 알고리즘이 불필요)
    2. 리렌더링시에 newNode(jsx)와 oldNode(jsx)를 받아온 다음에 diff 알고리즘을 수행하여 변경된 부분만 dom에 반영합니다.
 */

export function jsx(type, props, ...children) {
  return { type, props, children };
}

export function createElement(node) {
  const $element = document.createElement(node.type);

  if (node.props && "props" in node) {
    for (let [key, value] of Object.entries(node.props)) {
      $element.setAttribute(key, value);
    }
  }

  if (node.children && "children" in node) {
    node.children.forEach((children) => {
      if (typeof children === "string") {
        $element.insertAdjacentText("afterbegin", children);
        return;
      }

      if ("type" in children) {
        // const $children = createElement(children, { key: index });
        const $children = createElement(children);
        $element.insertAdjacentElement("beforeend", $children);
        return;
      }
    });
  }

  // jsx를 dom으로 변환
  return $element;
}

function updateAttributes(target, newProps, oldProps) {
  for (const [key, value] of Object.entries(newProps)) {
    if (key === "children" || oldProps[key] === value) continue;
    target.setAttribute(key, value);
  }

  for (const key in oldProps) {
    if (key === "children") continue;
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (deepEquals(newNode, oldNode)) return;

  if (!oldNode) {
    const newRenderNode = createElement(newNode);
    parent.insertAdjacentElement("beforeend", newRenderNode);
    // parent.appendChild(newRenderNode);
    return;
  }

  if (!newNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (
    typeof newNode !== typeof oldNode ||
    (typeof newNode === "string" && newNode !== oldNode) ||
    newNode.type !== oldNode.type
  ) {
    // parent.replaceChild(newNode, oldNode);
    const newRenderNode = createElement(newNode);
    parent.replaceChild(newRenderNode, parent.childNodes[index]);
  }

  if (!deepEquals(newNode.props, oldNode.props)) {
    const newNodeProps = newNode.props || {};
    const oldNodeProps = oldNode.props || {};

    updateAttributes(parent.children[index], newNodeProps, oldNodeProps);
    return;
  }

  if (newNode.type) {
    /*    const newNodeProps = newNode.props || {};
    const oldNodeProps = oldNode.props || {};

    if (deepEquals(newNodeProps, oldNodeProps)) {
    updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);
    }*/

    const newNodeChildren = newNode.children || [];
    const oldNodeChildren = oldNode.children || [];

    if (newNodeChildren.length !== oldNodeChildren.length) {
      const maxLength = Math.max(
        newNodeChildren.length,
        oldNodeChildren.length,
      );

      for (let i = 0; i < maxLength; i++) {
        render(
          parent.children[index],
          newNodeChildren[i],
          oldNodeChildren[i],
          i,
        );
      }
    }
  }
}
