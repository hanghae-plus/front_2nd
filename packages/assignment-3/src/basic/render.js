export function jsx(type, props, ...children) {
  //왜 통과가 안되는지 모르겠어요..
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  // jsx를 dom으로 변환

  return;
}

function updateAttributes(target, newProps, oldProps) {
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

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    return parent.removeChild(oldNode);
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료

  if (newNode && !oldNode) {
    return parent.appendChild(newNode);
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      return (parent.childNode[index].nodeValue = newNode);
    }
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  if (typeof newNode !== typeof oldNode) {
    return parent.replaceChild(createElement(newNode), parent.childNode[index]);
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNode[index], newNode.props, oldNode.props);
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출

  let a = newNode.length > oldNode.length ? newNode.length : oldNode.length;
  for (let i = 0; i < a; i++) {
    render(
      parent.childNode[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
