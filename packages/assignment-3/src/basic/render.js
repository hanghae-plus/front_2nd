
export function jsx(type, props, ...children) {
  return {type, props, children: children.flat()};
}

// [ jsx를 dom으로 변환 ]
export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const $el = document.createElement(node.type);

  if(node.props){
    Object.entries(node.props )
        .forEach(([i, value]) => (
            $el.setAttribute(i, value)
        ));
  }


  const childernList = node.children.map(createElement)
  childernList.forEach(child => $el.appendChild(child));

  return $el;
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
  const newKeys =   Object.keys(newProps);
  const oldKeys =  Object.keys(oldProps);

  for (let newKey of newKeys) {
    if (oldProps[newKey] !== newProps[newKey]) target.setAttribute(newKey, newProps[newKey]);
  }
  for (let oldKey of oldKeys) {
    if (newProps[oldKey] === undefined) target.removeAttribute(oldKey)
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if(!newNode && oldNode) return parent.removeChild(parent.childNode[index]);

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
  updateAttributes(parent.children[index], newNode.props || {}, oldNode.props || {});

    // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
    //   각 자식노드에 대해 재귀적으로 render 함수 호출
    const newNodeLength = newNode.children ? newNode.children.length : 0
    const oldNodeLength = oldNode.children ? oldNode.children.length : 0
    const cnt = Math.max(newNodeLength, oldNodeLength);


    for (let i = 0; i < cnt; i++) {
      render(
          parent.children[index],
          newNodeLength === 0 ? null : newNode.children[i],
          oldNodeLength === 0 ? null : oldNode.children[i],
          i
      );
    }
}
