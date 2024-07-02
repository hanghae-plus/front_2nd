export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  // jsx(node)를 dom(element)으로 변환
  // 1.Virtual DOM의 type에 맞는 실제 돔을 생성
  // 1)node가 null이나 undefined일 경우
  if (node === null || node === undefined) {
    return document.createDocumentFragment(); //새로운 documnetFragment 생성
  }

  // 2)문자열이나 number일때
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
    // createTextNode 메서드를 사용하면 HTML 문법에 영향을 받지 않는 텍스트를 추가할 수 있음
    // 이는 사용자가 입력한 내용을 그대로 화면에 출력하고자 할 때 유용함
  }

  //3) 그 외
  const element = document.createElement(node.type);

  // 2.props 있다면 적용
  if (node.props) {
    Object.keys(node.props).forEach((key) => {
      element.setAttribute(key, node.props[key]);
    });
  }

  // 3.Virtual DOM의 children을 재귀적으로 순회하면서 부모요소에 appendChild를 이용하여 부착
  node.children.forEach((child) => element.appendChild(createElement(child)));

  return element;
}

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // newProps들을 반복하여 각 속성과 값을 확인합니다.
  for (const prop in newProps) {
    if (oldProps[prop] !== newProps[prop]) {
      // 속성 값이 다르면 새 값을 설정합니다.
      target.setAttribute(prop, newProps[prop]);
    }
  }

  // oldProps들을 반복하여 각 속성을 확인합니다.
  for (const prop in oldProps) {
    if (!(prop in newProps)) {
      // newProps에 존재하지 않는 속성은 제거합니다.
      target.removeAttribute(prop);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    // oldNode만 있고 newNode가 없으면 oldNode를 제거합니다.
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    // newNode만 있고 oldNode가 없으면 newNode를 추가합니다.
    parent.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      // 두 노드가 문자열이나 숫자이고 서로 다르면 교체합니다.
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    // 두 노드의 타입이 다르면 교체합니다.
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // 속성을 업데이트합니다.
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  // 자식 노드들을 업데이트합니다.
  const newLength = newNode.children.length;
  const oldLength = oldNode.children.length;

  for (let i = 0; i < newLength || i < oldLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
