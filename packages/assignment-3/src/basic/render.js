export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() }
}


// createElement 함수는 JSX 객체를 실제 DOM 요소로 변환
export function createElement(node) {
  // node가 문자열이면 텍스트 노드를 생성
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  // node가 객체이면 해당 태그의 DOM 요소를 생성
  const element = document.createElement(node.type);

  // node에 props가 있으면 모든 속성을 설정
  if (node.props) {
    Object.keys(node.props).forEach(key => {
      element.setAttribute(key, node.props[key]);
    });
  }

  // 자식 노드들을 재귀적으로 생성하여 현재 요소에 추가
  node.children.forEach(child => {
    element.appendChild(createElement(child));
  });

  // 생성된 DOM 요소를 반환합니다.
  return element;
}
 

function updateAttributes(target, newProps = {}, oldProps = {}) {
  const props = { ...newProps, ...oldProps };
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
  

  Object.keys(props).forEach(name => {
    // newProps와 oldProps에서 현재 속성 값 가져오기
    const newValue = newProps[name];
    const oldValue = oldProps[name];

    if (newValue === undefined) { // newProps가 undefined일 경우 속성 제거
      target.removeAttribute(name);
    } else if (newValue !== oldValue) { // 속성 값이 다르면 속성 업데이트
      target.setAttribute(name, newValue);
    }
  });

}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  if (!newNode) {
    parent.removeChild(parent.childNodes[index]);
  } //   종료
   
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  else if (!oldNode) {
    parent.appendChild(createElement(newNode));
  }  //   종료 

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  else if (typeof newNode === 'string' || typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }}  //   종료
  
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  else if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  } //   종료
   
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  else {
    updateAttributes(parent.childNodes[index], newNode.props || {}, oldNode.props || {});
 
    // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
    //   각 자식노드에 대해 재귀적으로 render 함수 호출
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      render(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  } 
}
