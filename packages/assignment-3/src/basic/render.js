/**
 * @NOTE
 * jsx 객체를 반환한다.
 */
/**
 * @NOTE
 * jsx 객체를 반환한다.
 */
export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

/**
 * @NOTE ReactElement는 VDOM에서 사용되기 위한 DOM 노드와 같은 역할을 함.
 * Node의 종류
 * 1. Element
 * 2. Text
 * 3. Attribute
 * 4. Comment
 * @param {*} node
 * @returns
 */
export function createElement(node) {
  // jsx를 dom으로 변환
}

function updateAttributes(target, newProps, oldProps) {
  const allProps = { ...newProps, ...oldProps };

  for (const attrName of Object.keys(allProps)) {
    if (!newProps[attrName]) {
      target.removeAttribute(attrName);
    } else if (newProps[attrName] !== oldProps[attrName]) {
      target.setAttribute(attrName, newProps[attrName]);
      //기존것 빼줘야하나?
    }
  }
}

/**
 * @NOTE 가상 VDOM 을 만든다.
 * 1. newNode가 추가되었을 때
 * 2. oldNode가 제거되었을 때
 * 3. 변경 되었을 때
 * 4. 속성 갱신
 * 5. 자식노드 재귀
 * @param {*} parent ReactElement
 * @param {*} newNode 새로운 node
 * @param {*} oldNode 이전 node
 * @param {*} index
 */
export function render(parent, newNode, oldNode, index = 0) {
  //1. 새로운 Node는 있고, 이전 Node가 없으면 => 새로운 Node추가
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  //2. 기존 Node는 있고, 새로운 Node가 없으면 => 기존 Node제거
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNodes[index]);
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  // 5. newNode와 oldNode에 대해 updateAttributes 실행

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
}
