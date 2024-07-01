import { deepEquals } from "../../../assignment-2/src/basic/basic";
import { isNill } from "./utils";

export function jsx(type, props, ...children) {
  return {
    type,
    props,
    children,
  };
}

function setProp(target, key, value) {
  if (key === "class") {
    target.classList.add(value);
    // https://stackoverflow.com/questions/507138/how-to-add-a-class-to-a-given-element

    return;
  }
  target[key] = value;
}

function removeProp(target, key) {
  target.removeAttribute(key);
}

export function createElement(node) {
  const element = document.createElement(node.type);

  if (!isNill(node.props)) {
    const propKeys = Object.keys(node.props);

    for (let propKey of propKeys) {
      setProp(element, propKey, node.props[propKey]);
    }
  }

  if (Array.isArray(node.children)) {
    for (let child of node.children) {
      if (typeof child === "string") {
        element.innerHTML += child;
        continue;
      }
      element.appendChild(createElement(child));
      // https://www.w3schools.com/jsref/met_node_appendchild.asp
    }
  }
  return element;
  // jsx를 dom으로 변환
}

function updateAttributes(target, newProps, oldProps) {
  const newKeys = isNill(newProps) ? [] : Object.keys(newProps);
  const oldKeys = isNill(oldProps) ? [] : Object.keys(oldProps);

  for (let newKey of newKeys) {
    if (
      isNill(oldProps) ||
      isNill(oldProps[newKey]) ||
      !deepEquals(newProps[newKey], oldProps[newKey])
    ) {
      setProp(target, newKey, newProps[newKeys]);
    }
  }
  for (let oldKey of oldKeys) {
    if (isNill(newProps) || isNill(newProps[oldKey])) {
      removeProp(target, oldKey);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (isNill(newNode) && !isNill(oldNode)) {
    // console.log(
    //   "만약 newNode가 없고 oldNode만 있다면 parent에서 oldNode를 제거"
    // );
    const oldElement = createElement(oldNode);

    if (oldElement.outerHTML === parent.outerHTML) {
      parent.remove();
    }

    for (const child of parent.children) {
      render(child, newNode, oldNode);
    }

    // TODO: parent에 있는 모든 oldNode를 제거할 건지, 하나만 제거하고 멈출건지 확정(지금은 모든 노드 제거)
    return;
  }

  if (!isNill(newNode) && isNill(oldNode)) {
    // console.log(
    //   "만약 newNode가 있고 oldNode가 없다면 newNode를 생성하여 parent에 추가"
    // );
    const newElement = createElement(newNode);

    if (isNill(parent)) {
      parent = newElement;
    } else {
      parent.append(newElement);
    }

    return;
  }

  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    // console.log(
    //   "만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면 oldNode를 newNode로 교체"
    // );
    if (parent.innerHTML === oldNode) {
      parent.innerHTML = newNode;
    }

    for (const child of parent.children) {
      render(child, newNode, oldNode);
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    // console.log("newNode와 oldNode의 타입이 다르다면 oldNode를 newNode로 교체");
    const oldElement = createElement(oldNode);
    // TODO: 모든 재귀 호출에서 계속 oldElement 생성하는 중
    // TODO: 근데 타입끼리 비교하려면 맨 처음에 생성하고 계속 가지고 내려가기 힘들 듯?

    if (oldElement.outerHTML === parent.outerHTML) {
      const newElement = createElement(newNode);
      const grandParent = parent.parentNode;
      grandParent.replaceChild(newElement, parent);
      // https://developer.mozilla.org/ko/docs/Web/API/Node/replaceChild
    }

    for (const child of parent.children) {
      render(child, newNode, oldNode);
    }

    // TODO: parent에 있는 모든 oldNode를 변경할 건지, 하나만 변경하고 멈출건지 확정(지금은 모든 노드 변경)
    return;
  }

  if (deepEquals(newNode, oldNode)) {
    return;
  }

  // console.log("newNode와 oldNode에 대해 updateAttributes 실행");
  if (parent.children.length > index) {
    updateAttributes(parent.children[index], newNode.props, oldNode.props);
  }

  // console.log(
  //   "newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복, 자식노드 재귀호출"
  // );
  const maxChildrenCnt =
    newNode.children.length > oldNode.children.length
      ? newNode.children.length
      : oldNode.children.length;

  for (let i = 0; i < maxChildrenCnt; i++) {
    for (const child of parent.children) {
      render(child, newNode.children[i], oldNode.children[i]);
    }
  }
}
