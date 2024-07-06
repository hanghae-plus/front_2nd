export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  const result = document.createElement(node.type);

  if(node.props) {
    Object.entries(node.props).forEach(([key, value]) => {
      result.setAttribute(key, value);
    })
  }

  node.children?.forEach((child) => {
    let subElement;

    if(typeof child === 'string') {
      subElement = document.createTextNode(child);
    } else {
      subElement = createElement(child);
    }
    
    if(subElement) {
      result.appendChild(subElement);
    }
  })

  return result;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  if(newProps) {
    Object.entries(newProps).forEach(([key, value]) => {
      const oldValue = oldProps[key];
      
      if(!oldValue || value !== oldValue) {
        target.setAttribute(key, value);
      }
    })
  }

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  if(oldProps) {
    Object.entries(oldProps).forEach(([key, value]) => {
      const newValue = newProps ? newProps[key] : null;
      
      if(!newValue) {
        target.removeAttribute(key);
      } else if(value !== newValue) {
        target.setAttribute(key, value);
      }
    })
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if(!newNode && oldNode) {
    parent.removeChild(oldNode);
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if(newNode && !oldNode) {
    const addNode = createElement(newNode);
    parent.appendChild(addNode);
    return;
  }


  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(typeof newNode === 'string' 
      && typeof oldNode === 'string'
      && newNode !== oldNode) {
    parent.replaceChild(newNode, oldNode);
    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(newNode.type !== oldNode.type) {
    parent.replaceChild(newNode, oldNode);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent?.children[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newLength = newNode.children?.length || 0;
  const oldLength = oldNode.children?.length || 0;

  if(newLength > 0 && newLength >= oldLength) {
    newNode.children.forEach((node, idx) => {
      const oldChild = oldNode.children[idx] || null;
      render(parent.children[index], node, oldChild, index+1);
    })
  } else if (oldLength > 0 && oldLength > newLength) {
    oldNode.children.forEach((node, idx) => {
      const newChild = newNode.children[idx] || null;
      render(parent.children[index], newChild, node, index+1);
    })
  }
}
