export function jsx(type, props, ...children) {
  return {
    type: type,
    props: props,
    children: children,
  };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  let $el;
  if (typeof node === 'string') {
    $el = document.createTextNode(node);
  } else {
    $el = document.createElement(node.type);

    if (node.props !== null && typeof node.props === 'object') {
      Object.entries(node.props).forEach(([key, value]) =>
        $el.setAttribute(key, value)
      );
    }

    if (node.children.length > 0) {
      node.children.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }
  }
  return $el;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  if (newProps !== null && newProps instanceof Object) {
    Object.entries(newProps).forEach(([key, value]) => {
      //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
      //     다음 속성으로 넘어감 (변경 불필요)
      //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
      if (oldProps[key] && oldProps[key] === value) {
      }
    });
  }
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

export function render(parent, newNode, oldNode, index = 0) {
  // const newElement = createElement(newNode);
  // 1. 만약 newNode가 없고 oldNode만 있다면
  if (!newNode && oldNode) {
    //   parent에서 oldNode를 제거
    parent.removeChild();
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
    typeof newNode === 'string' &&
    typeof oldNode === 'string' &&
    newNode !== oldNode
  ) {
    //   oldNode를 newNode로 교체
    parent.replaceChild(
      createElement(newNode, oldNode),
      parent.children[index]
    );
    //   종료
    return;
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  if (typeof newNode !== typeof oldNode) {
    //   oldNode를 newNode로 교체
    parent.replaceChild(
      createElement(newNode, oldNode),
      parent.children[index]
    );
    //   종료
    return;
  }
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent, newNode.props, oldNode.props);
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  const newChildren = newNode.children;
  const oldChildren = oldNode.children;
  const maxLength = Math.max(
    newChildren?.length || 0,
    oldChildren?.length || 0
  );
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  for (let i = 0; i < maxLength; i++) {
    render(parent.children[index], newChildren[i], oldChildren[i], i);
  }
}
