export function jsx(type, props, ...children) {
  // jsx를 객체로 변환
  // 1. type, props, children을 속성으로 가지는 객체 생성
  // 2. 생성한 객체 반환
  return {
    type,
    props: props || {},
    children
  }
}

export function createElement(node) {
  let $el;
  // jsx를 dom으로 변환
  // 1. node의 type이 문자열이라면
  //   해당 타입의 엘리먼트를 생성
  if (typeof node.type === 'string') {
    $el = document.createElement(node.type)
  }
  // 2. node의 props를 반복하여
  //   해당 엘리먼트의 속성을 설정
  for (let props in node.props) {
    $el.setAttribute(props, node.props[props])
  }
  // 3. node의 children을 반복하여
  //   해당 엘리먼트의 자식노드로 추가
  for (const child of node.children) {
    if (typeof child === 'string') {
      $el.appendChild(document.createTextNode(child))
    } else {
      $el.appendChild(createElement(child))
    }
  }
  // 4. 생성한 엘리먼트 반환
  return $el;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  for (let props in newProps) {
    if (oldProps[props] === newProps[props]) {
      continue;
    }
    target.setAttribute(props, newProps[props])
  }

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for (let props in oldProps) {
    if (newProps[props]) {
      continue;
    }
    target.removeAttribute(props)
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    parent.removeChild(oldNode)
    return
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode))
    return
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type === 'string' && oldNode.type === 'string') {
    if (newNode !== oldNode) {
      parent.replaceChild(createElement(newNode), oldNode)
    }
    return
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), oldNode)
    return
  }
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  //   newNode의 속성을 기준으로 oldNode의 속성을 업데이트
  updateAttributes(oldNode, newNode.props, oldNode.props)

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출

  //   남은 newNode들을 추가
  //   oldNode가 더 길다면
  //   oldNode의 자식노드들을 기준으로 반복
  render(parent, oldNode.children[index], newNode.children[index], index)

  //   남은 oldNode들을 제거
  //   newNode가 더 길다면
  //   newNode의 자식노드들을 기준으로 반복
  render(parent, newNode.children[index], oldNode.children[index], index)
}
