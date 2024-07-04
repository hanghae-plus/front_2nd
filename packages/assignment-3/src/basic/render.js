export function jsx(type, props, ...children) {
  // jsx 객체생성
  return {
    type,
    props: {
      ...props,
      children: children
    }
  };
}

export function createElement(node) {
  // node가 string 형식이라면 teextmode로 추가
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }


  const element = document.createElement(node.type);

  if (node.props) {
    Object.keys(node.props).forEach(key => {
      if (key === 'children') {
        // children 프로퍼티는 별도 처리
        if (Array.isArray(node.props.children)) {
          node.props.children.forEach(child => {
            element.appendChild(createElement(child));
          });
        } else {
          element.appendChild(createElement(node.props.children));
        }
      } else {
        // 기타 프로퍼티는 바로 추가 
        element.setAttribute(key, node.props[key]);
      }
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
  for(const [key, value] of Object.entries(newProps)){
    if(oldProps[key] === value){
      continue;
    }
    target.setAttribute(key, value);
  }

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for(const key of Object.keys(oldProps)){
    if(newProps[key]){
      continue;
    }
    target.removeAttribute(key);
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if(!newNode && oldNode){
    parent.removeChild(oldNode);
    return parent;
  }
  
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if(newNode && !oldNode){
    const $el = createElement(newNode);
    // TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
    // at render (src/basic/render.js:86:10)
    parent.appendChild($el);
    return parent;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(typeof newNode === 'string' && typeof oldNode === 'string' ){
    if (newNode !== oldNode){
      parent.replaceChild(createElement(newNode), oldNode);
    }
    return parent;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(newNode.type !== oldNode.type){
    parent.replaceChild(createElement(newNode), oldNode);
    return parent;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent, newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  let longer = newNode.props.children.length > oldNode.props.children.length ? newNode : oldNode;
  let shorter = newNode.props.children.length > oldNode.props.children.length ? oldNode : newNode;
  
  // 세번째 문단(자식노드)이 부모노드 안으로 들어오지않는 문제 수정 중(WIP)
  // <div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div><p>세 번째 문단</p>

  for(let i = 0; i < longer.props.children.length; i++){
    render(parent, longer.props.children[i], shorter.props.children[i] , i);
  }

  return parent;

}
