// @ts-check

/**
 * jsx
 * @typedef {Object} jsx
 * @property {string} type
 * @property {null | {id?: string, class?: string}} props
 * @property {(string | jsx)[]} children
 */

/**
 *
 * @param {jsx['type']} type - node name
 * @param {jsx['props']} props
 * @param {string[] | jsx[]} children
 * @returns {jsx}
 */
export function jsx(type, props = null, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}

/**
 *
 * @param {string | jsx} node
 * @returns {HTMLElement}
 */
export function createElement(node) {
  // jsx를 dom으로 변환
  if (typeof node === "string") {
    return document.createElement(node);
  }
  const dom = document.createElement(node.type);
  if (node.props) {
    if (node.props.id) dom.setAttribute("id", node.props.id);
    if (node.props.class) dom.setAttribute("class", node.props.class);
  }
  if (typeof node.children[0] === "string") {
    dom.innerHTML = node.children[0];
  } else {
    node.children.forEach((jsx) => {
      dom.appendChild(createElement(jsx));
    });
  }

  return dom;
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
  // const parentJsx = createElement(parent);
  if (!newNode && oldNode) {
    console.log("case1");
  }
  if (newNode && oldNode == null) {
    parent.appendChild(createElement(newNode));
  }
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
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
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
}

/**
1. jsx 함수를 구현합니다. (dom 구조와 비슷한 객체를 만들어서 사용하기 위함)
2. createElement 함수를 구현합니다. (jsx를 dom으로 변환하는 함수)
3. render 함수를 구현합니다. (dom에 jsx를 diff 알고리즘으로 반영하는 함수)
4. render함수는 다음과 같이 동작합니다.
    1. 최초 렌더링시에 newNode(jsx)를 받아와서 dom으로 변환합니다. (diff 알고리즘이 불필요)
    2. 리렌더링시에 newNode(jsx)와 oldNode(jsx)를 받아온 다음에 diff 알고리즘을 수행하여 변경된 부분만 dom에 반영합니다.
 */
