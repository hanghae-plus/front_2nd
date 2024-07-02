export function jsx(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

export function createElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  // jsx를 dom으로 변환
  const element = document.createElement(node.type);

  if (node.props) {
    const propsArray = Object.keys(node.props);
    propsArray.map((key) => element.setAttribute(key, node.props[key]));
  }

  if (node.children) {
    console.log(node.children);
    node.children.map((v) => {
      element.appendChild(createElement(v));
    });
  }

  return element;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  newProps = newProps || {};
  oldProps = oldProps || {};

  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] !== value) {
      target.setAttribute(key, value);
    }
  });

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  });
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  const oldChildNode = parent.childNodes[index];
  if (!newNode && oldNode) {
    //   parent에서 oldNode를 제거
    parent.removeChild(oldChildNode);
    //   종료
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  if (newNode && !oldNode) {
    //   newNode를 생성하여 parent에 추가
    parent.appendChild(createElement(newNode));
    //   종료
    return;
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    //   oldNode를 newNode로 교체
    oldChildNode.nodeValue = newNode;
    //   종료
    return;
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  if (newNode.type !== oldNode.type) {
    //   oldNode를 newNode로 교체
    parent.replaceChild(createElement(newNode), oldChildNode);
    //   종료
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const length = Math.max(newChildren.length, oldChildren.length);

  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  for (let i = 0; i < length; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
