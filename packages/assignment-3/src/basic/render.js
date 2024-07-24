export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  const { type, props, children = [] } = node;

  const element = document.createElement(type);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  children.forEach((node) => {
    if (typeof node === "string") {
      element.textContent = node;
    } else {
      element.appendChild(createElement(node));
    }
  });
  return element;
}

function updateAttributes(target, newProps, oldProps) {
  newProps = newProps || {};
  oldProps = oldProps || {};

  Object.entries(newProps).forEach(([name, value]) => {
    if (oldProps[name] !== value) {
      target.setAttribute(prop, newProps[prop]);
    }
  });

  Object.keys(oldProps).forEach((name) => {
    if (newProps[name] === undefined) {
      target.removeAttribute(name);
    }
  });
}

/**
 * 단순히 jsx를 렌더링하는 함수가 아니라 oldNode를 newNode로 변환
 * */
export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    parent.removeChild(createElement(oldNode));
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    parent.replaceChild(createElement(newNode), createElement(oldNode));
    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.nodeType !== oldNode.nodeType) {
    parent.replaceChild(createElement(newNode), createElement(oldNode));
    return;
  }

  // 부모 DOM은 변경 대상에 제외 해야하므로 -> parent.childNodes[index]

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
