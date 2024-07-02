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
      setProp(target, newKey, newProps[newKey]);
    }
  }
  for (let oldKey of oldKeys) {
    if (isNill(newProps) || isNill(newProps[oldKey])) {
      removeProp(target, oldKey);
    }
  }
}

/**
 * parent는 현재 타겟 서브트리.
 * 그 children들을 확인하는 것은 필요 없음.
 * newNode만 있고 oldNode는 없는 상태로 초기 호출.
 * 그 이후의 호출은 newNode, oldNode 모두 있는 상태로 이루어진다고 가정.
 * 실제 호출부에서는 index 파라미터를 사용하지 않음(root element의 아래로 내려갈 때 하나는 그냥 내려가야 하기 때문).
 * 재귀 호출부에서 각 children을 순회하기 위한 용도로 index를 사용
 * -> children[i]를 그대로 재귀호출하지 않는 이유는 그 윗 뎁스에서 해당 Child를 지워주는 게 적절하기 때문?
 * -> element.remove()를 사용할 수도 있긴 함
 * -> 사실상 조작 타겟은 parent.children[index]가 되는 방식으로 구현
 */
export function render(parent, newNode, oldNode, index = 0) {
  if (deepEquals(newNode, oldNode)) {
    /**
     * render(parent, node, node, index) 방식의 호출
     * newNode와 oldNode가 같을 경우
     */
    return;
  }

  if (!isNill(newNode) && isNill(oldNode)) {
    /**
     * render(parent, newNode, undefined, index) 방식의 호출
     * newNode는 존재하지만, oldNode는 존재하지 않을 경우
     */
    const newElement = createElement(newNode);
    parent.append(newElement);

    return;
  }

  if (isNill(newNode) && !isNill(oldNode)) {
    /**
     * render(parent, undefined, oldNode, index) 방식의 호출
     * oldNode는 존재하지만, NewNode는 존재하지 않을 경우
     */
    try {
      parent.removeChild(parent.children[index]);
    } catch (e) {
      console.log(parent.outerHTML, index);
    }

    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    /**
     * render(parent, newNode="ABC", oldNode="AB", index) 방식의 호출
     * oldNode와 newNode 둘 다 string이고 값이 다를 경우
     */
    parent.innerHTML = newNode;

    return;
  }

  if (newNode.type !== oldNode.type) {
    /**
     * render(parent, divNode, anchorNode, index) 방식의 호출
     * newNode와 oldNode의 type이 다를 경우, oldNode를 newNode로 교체
     */
    parent.replaceChild(createElement(newNode), parent.children[index]);

    return;
  }

  /**
   * render(parent, newNode, oldNode, index) 방식의 호출
   * newNode와 oldNode가 서로 다를 경우, oldNode를 NewNode로 교체해야 함.
   * 정확하게 그 뎁스들을 파라미터로 하는 재귀호출부에서 갱신해줄 것이기 때문에 여기서는 updateAttributes만 호출해주면 충분함.
   */
  updateAttributes(parent.children[index], newNode.props, oldNode.props);

  /**
   * 재귀호출부
   * parent의 모든 sub tree에 대해 다음 재귀 호출
   * newNode와 oldNode 중 children의 길이가 긴 node를 기준으로 render함수 재귀 호출
   * parent의 sub tree를 호출할 때 index를 내려주면서 한 뎁스씩 내려감
   */
  const biggerNodeChildrenCnt = Math.max(
    newNode.children.length ?? 0,
    oldNode.children.length ?? 0
  );

  /**
   * 다수의 노드를 삭제할 때 인덱스상 작은 노드부터 삭제할 경우 참조에 문제가 있을 수 있어 큰 인덱스부터 순회
   * ex) 0, 1, 2번 노드 중 1, 2번 삭제해야하는 경우 1번이 삭제되면 2번 재귀함수는 가리키는 노드가 사라져
   * 제대로 된 연산이 이루어지지 않음. 따라서 2 -> 1 순으로 삭제하도록 큰 인덱스부터 순회.
   */
  for (let i = biggerNodeChildrenCnt; i > -1; i--) {
    render(
      parent.children[index],
      newNode.children.length === 0 ? null : newNode.children[i],
      oldNode.children.length === 0 ? null : oldNode.children[i],
      i
    );
  }
}
