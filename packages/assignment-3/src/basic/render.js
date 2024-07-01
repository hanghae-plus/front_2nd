export function jsx(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

export function createElement(node) {
  // jsx를 dom으로 변환

  if (typeof node === "string") {
    // node의 타입으로는 언제나 'object' 또는 'string'이 온다. (children이 재귀 돌때 string, jsx의 리턴값일때 object)
    return document.createTextNode(node); // 텍스트 노드를 생성 (Web API)
  }

  const dom = document.createElement(node.type); // 새 HTML 요소 생성 ex) <div></div> 생성

  if (node.props) {
    Object.keys(node.props).forEach((key) => {
      dom.setAttribute(key, node.props[key]); // 지정된 요소의 속성 값을 설정하는 방법. 속성이 이미 있으면 값은 업데이트 된다.
    });
  }

  node.children.forEach((child) => dom.appendChild(createElement(child))); // appendChild는 오직 요소만을 인수로 받으며, 부모 노드의 마지막 자식 노드로 붙는다.

  return dom;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  // 만약 oldProps에 같은 속성이 있고 값이 동일하다면 다음 속성으로 넘어감 (변경 불필요)
  // 만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음) target에 해당 속성을 새 값으로 설정
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      target.setAttribute(key, newProps[key]);
    }
  }
  // oldProps을 반복하여 각 속성 확인
  // 만약 newProps들에 해당 속성이 존재한다면 다음 속성으로 넘어감 (속성 유지 필요)
  // 만약 newProps들에 해당 속성이 존재하지 않는다면 target에서 해당 속성을 제거
  for (const key in oldProps) {
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!parent) {
    parent = document.createElement("div");
  }
  // 1. 만약 newNode가 없고 oldNode만 있다면 parent에서 oldNode를 제거 후 종료
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면 newNode를 생성하여 parent에 추가 후 종료
  if (newNode && !oldNode) {
    const newDomNode = createElement(newNode);
    parent.appendChild(newDomNode);
    return;
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면 oldNode를 newNode로 교체 후 종료
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    parent.childNodes[index].nodeValue = newNode;
    return;
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면 oldNode를 newNode로 교체 후 종료
  if (newNode.type !== oldNode.type) {
    const newDomNode = createElement(newNode);
    parent.replaceChild(newDomNode, parent.childNodes[index]); // Node.replaceChild() 메소드는 특정 부모 노드의 한 자식 노드를 다른 노드로 교체합니다.
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  // 각 자식노드에 대해 재귀적으로 render 함수 호출
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
