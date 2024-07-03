/**
 * jsx 생성 함수
 *
 * @param {string} type 태그 타입
 * @param {*} props 태그에 포함될 속성 정보 // {속성 키: 속성 값}
 * @param  {...any} children 자식 노드 // 문자열 | jsx 객체 ...
 * @returns jsx 객체
 */
export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

/**
 * jsx 객체에서 DOM 요소로 변환하는 함수
 *
 * @param {*} node 노드 // 문자열 | jsx 객체 ...
 * @returns
 */
export function createElement(node) {
  // 만약 노드 타입이 문자열이면 텍스트 노드로 생성
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  // 노드(jsx 객체)의 태그 타입 정보로 실제 요소를 만듦
  const el = document.createElement(node.type);

  // 노드의 속성 정보로 실제 요소에 속성(attribute) 추가
  Object.entries(node.props || {}).forEach(function (ref) {
    const attr = ref[0];
    const value = ref[1];

    return value && el.setAttribute(attr, value);
  });

  // 자식 노드 순회하면서 요소로 변환 > 실제 자식 노드로 추가
  try {
    node.children.map(createElement).forEach(function (child) {
      return el.appendChild(child);
    });
  } catch (e) {
    console.log(node);
    console.error(e);
  }

  return el;
}

/**
 * 속성 정보 업데이트 함수
 *
 * @param {*} target 속성을 비교할 요소(노드)
 * @param {*} newProps 새로운 속성 값
 * @param {*} oldProps 기존 속성 값
 *
 * newProps들을 반복하여 각 속성과 값을 확인
 * 만약 oldProps에 같은 속성이 있고 값이 동일하다면
 * > 다음 속성으로 넘어감 (변경 불필요)
 * 만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
 * > target에 해당 속성을 새 값으로 설정
 *
 * oldProps을 반복하여 각 속성 확인
 * 만약 newProps들에 해당 속성이 존재한다면
 * > 다음 속성으로 넘어감 (속성 유지 필요)
 * 만약 newProps들에 해당 속성이 존재하지 않는다면
 * > target에서 해당 속성을 제거
 */
function updateAttributes(target, newProps, oldProps) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}

/**
 * 렌더 함수
 *
 * @param {*} parent 부모 노드
 * @param {*} newNode 새로운 노드
 * @param {*} oldNode 기존 노드
 * @param {*} index 자식 노드 인덱스 // 0으로 지정해 첫번째 자식만 가져온다.
 * @returns
 *
 * 1. 만약 newNode가 없고 oldNode만 있다면
 * > parent에서 oldNode를 제거
 * > 종료
 * 2. 만약 newNode가 있고 oldNode가 없다면
 * > newNode를 생성하여 parent에 추가
 * > 종료
 * 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
 * > oldNode를 newNode로 교체
 * > 종료
 * 4. 만약 newNode와 oldNode의 타입이 다르다면
 * > oldNode를 newNode로 교체
 * > 종료
 * 5. newNode와 oldNode에 대해 updateAttributes 실행
 * 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
 * > 각 자식노드에 대해 재귀적으로 render 함수 호출
 */
export function render(parent, newNode, oldNode, index = 0) {
  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNode[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode === oldNode) return;
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
