// JSX를 가상 DOM 객체로 변환
export function jsx(type, props, ...children) {
  // props가 없을 경우를 대비해 빈 객체로 초기화
  // children을 평탄화하여 중첩된 배열 구조 제거
  return { type, props: props || {}, children: children.flat() };
}

// 가상 DOM을 실제 DOM 요소로 변환
export function createElement(node) {
  // 문자열 노드는 텍스트 노드로 처리
  if (typeof node === "string") return document.createTextNode(node);

  const element = document.createElement(node.type);

  // 속성 설정: 객체의 각 키-값 쌍을 순회하며 setAttribute 호출
  Object.entries(node.props || {}).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });

  // 자식 요소 추가: 재귀적으로 createElement 호출
  (node.children || []).forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

// DOM 요소의 속성을 효율적으로 업데이트
function updateAttributes(target, newProps, oldProps) {
  // undefined 방지를 위해 빈 객체로 초기화
  newProps = newProps || {};
  oldProps = oldProps || {};

  // 새 속성 설정 또는 업데이트
  // 이전 값과 다른 경우에만 setAttribute 호출하여 불필요한 DOM 조작 방지
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] !== value) {
      target.setAttribute(attr, value);
    }
  }

  // 제거된 속성 정리
  // 새 props에 없는 이전 속성들을 제거
  for (const attr in oldProps) {
    if (!(attr in newProps)) {
      target.removeAttribute(attr);
    }
  }
}

// 가상 DOM을 실제 DOM에 효율적으로 반영 (재귀 함수)
export function render(parent, newNode, oldNode, index = 0) {
  // 케이스 1: 노드 제거 (새 노드 없음)
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  // 케이스 2: 새 노드 추가 (이전 노드 없음)
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // 케이스 3: 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      // 텍스트가 변경된 경우에만 노드 교체
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    return;
  }

  // 케이스 4: 노드 타입 변경
  if (newNode.type !== oldNode.type) {
    // 타입이 다르면 노드 전체를 교체
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // 케이스 5: 속성 업데이트 (같은 타입의 요소)
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 케이스 6: 자식 노드들 재귀적 업데이트
  // 새 노드와 이전 노드의 자식 중 더 긴 길이를 기준으로 순회
  const childCount = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0
  );

  for (let i = 0; i < childCount; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
