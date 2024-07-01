// @ts-check

import { deepEquals } from "../../../assignment-2/src/basic/basic";

/**
 * jsx
 * @typedef {Object} jsx
 * @property {string} type
 * @property {null | {id?: string, class?: string}} props
 * @property {(string | jsx)[]} children
 */

/**
 * node
 * @typedef {jsx | string} node
 */

/**
 * jsx를 생성합니다.
 * @param {jsx['type']} type - node name
 * @param {jsx['props']} props
 * @param {string[] | jsx[]} children
 * @returns {jsx}
 */
export function jsx(type, props = null, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}

/**
 * node 정보를 받아 HTMLElement를 만듭니다.
 * @param {node} node
 * @returns {HTMLElement}
 */
export function createElement(node) {
  // jsx를 dom으로 변환
  if (typeof node === "string") {
    return document.createElement(node);
  }

  const dom = document.createElement(node.type);

  if (node.props !== null) {
    Object.keys(node.props).forEach((key) => {
      dom.setAttribute(key, node.props[key]);
    });
  }

  if (node.children?.length >= 0) {
    if (typeof node.children[0] === "string") {
      dom.innerHTML = node.children[0];
    } else {
      node.children.forEach((jsx) => {
        dom.appendChild(createElement(jsx));
      });
    }
  }

  return dom;
}

/**
 * oldProps와 newProps를 비교하여 변경점을 반영합니다.
 * @param {HTMLElement} target
 * @param {jsx['props']} newProps
 * @param {jsx['props']} oldProps
 */
function updateAttributes(target, newProps, oldProps) {
  if (oldProps == null || target == null) return;

  if (newProps == null) {
    target.removeAttribute("id");
    target.removeAttribute("class");
    return;
  }

  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      target.setAttribute(key, newProps[key]);
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  }

  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

/**
 * oldNode와 newNode 중 긴 node를 기준으로 동일한 child가 있는지 확인하고 update 합니다.
 * @param {Node} parent
 * @param {jsx} newNode
 * @param {jsx} oldNode
 */
function updateNodes(parent, newNode, oldNode) {
  if (parent == null) return;
  const longerNode =
    newNode.children.length >= oldNode.children.length ? newNode : oldNode;
  const shorterNode = longerNode === newNode ? oldNode : newNode;

  const equalIdx = [];
  longerNode.children.forEach((child, i) => {
    if (deepEquals(child, shorterNode.children[i])) equalIdx.push(i);
  });
  const oldLength = parent.firstChild?.childNodes.length;
  if (oldLength === equalIdx.length) {
    longerNode.children.forEach((child, i) => {
      if (i >= oldLength) parent.firstChild?.appendChild(createElement(child));
    });
  }
}

/**
 *
 * @param {Node} parent
 * @param {node} newNode
 * @param {node} oldNode
 * @param {number} index
 */
export function render(parent, newNode, oldNode, index = 0) {
  if (parent == null) return;

  // case1
  if (newNode == null && oldNode) {
    const child = parent.firstChild;
    if (child) parent.removeChild(child);
    return;
  }

  // case2
  if (newNode && oldNode == null) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // case3, case4
  if (
    (typeof newNode === "string" &&
      typeof oldNode === "string" &&
      newNode !== oldNode) ||
    (typeof newNode !== "string" &&
      typeof oldNode !== "string" &&
      newNode.type !== oldNode.type)
  ) {
    const child = parent.firstChild;
    if (child) parent.replaceChild(child, createElement(newNode));
    return;
  }

  // case5, case6
  if (
    typeof newNode !== "string" &&
    typeof oldNode !== "string" &&
    newNode.children.length > 0 &&
    oldNode.children.length > 0
  ) {
    updateNodes(parent, newNode, oldNode);
    updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);
    const max = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < max; i++) {
      render(parent.childNodes[i], newNode.children[i], oldNode.children[i], i);
    }
  }
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  //   }

  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
}

/**
1. jsx 함수를 구현합니다. (dom 구조와 비슷한 객체를 만들어서 사용하기 위함)
2. createElement 함수를 구현합니다. (jsx를 dom으로 변환하는 함수)
3. render 함수를 구현합니다. (dom에 jsx를 diff 알고리즘으로 반영하는 함수)
4. render함수는 다음과 같이 동작합니다.
    1. 최초 렌더링시에 newNode(jsx)를 받아와서 dom으로 변환합니다. (diff 알고리즘이 불필요)
    2. 리렌더링시에 newNode(jsx)와 oldNode(jsx)를 받아온 다음에 diff 알고리즘을 수행하여 변경된 부분만 dom에 반영합니다.
 */
