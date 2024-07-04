// jsx는 render가 감싸져 사용합니다.
// 따라서 jsx에서 object로 형태를 만든 후, createElement를 사용해 render에서 node로 변경해줍니다.
export function jsx(type, props, ...children) {
  // 객체 구조 반환
  return { type, props: props || {}, children };
}

export function createElement(node) {
  // type 속성이 문자열 또는 객체가 될 수 있음

  // children이 string으로 들어올 수 있음
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  // 요소 노드인 경우
  const element = document.createElement(node.type);

  // 속성(props) 설정
  Object.entries(node.props).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  // children 설정
  node.children.forEach((child) => {
    element.appendChild(createElement(child));
  });
  return element;
}

function updateAttributes(target, newProps, oldProps) {
  Object.entries(oldProps || {}).forEach(([key, _]) => {
    // 새 속성 설정 또는 업데이트
    if (oldProps[key] !== newProps[key]) {
      target.setAttribute(key, newProps[key]);
    }

    // 더 이상 필요 없는 속성 제거
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  });
}

// test 코드 내에 parent는 진짜 node / newNode, oldNode는 jsx를 가져옵니다.
export function render(parent, newNode, oldNode, index = 0) {
  // newNode가 없고 oldNode만 있는 경우 (요소 제거)
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes);
    return;
  }

  // newNode만 있고 oldNode가 없는 경우 (새 요소 추가)
  if (newNode && !oldNode) {
    const newElementNode = createElement(newNode);
    parent.appendChild(newElementNode);
    return;
  }

  // 둘 다 없는 경우
  if (!newNode && !oldNode) {
    return;
  }

  // 둘 다 문자열인 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parent.childNodes.nodeValue = newNode;
    }
    return;
  }

  // 타입이 다른 경우
  if (newNode.type !== oldNode.type) {
    const newElementNode = createElement(newNode);
    parent.replaceChild(newElementNode, parent.childNodes);
    return;
  }

  // 속성 업데이트
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 자식 노드 재귀적 처리
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  [...new Array(maxLength)].forEach((_, i) => {
    render(parent.childNodes[index], newChildren[i], oldChildren[i], i);
  });
}
