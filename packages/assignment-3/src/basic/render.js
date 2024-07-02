const util = require("util");

const checkDepth = (obj) => {
  console.log(util.inspect(obj, false, null, true));
};

export function jsx(type, props, ...children) {
  //object 복사
  const prop = Object.assign({}, props);

  // 자식 노드 여부에 따라 jsx구성하기
  children.length > 1
    ? (prop.children = children)
    : (prop.children = children[0]);

  return {
    type,
    prop,
  };
}

export function createElement(node) {
  const { type, prop: props } = node;

  const $node = document.createElement(type);

  for (let key in props) {
    const attribute = props[key];

    // children이 string일 때 그대로 text넣기
    if (key === "children") {
      if (typeof attribute === "string") {
        //innerText시 오류,,
        $node.textContent = attribute;
      } else {
        if (attribute.length) {
          for (let ele in attribute) {
            const childrens = attribute[ele];
            const $childNode = createElement(childrens);
            $node.appendChild($childNode);
          }
        } else {
          const $childNode = createElement(attribute);
          $node.appendChild($childNode);
        }
      }
      continue;
    }

    $node.setAttribute(key, attribute);
  }

  return $node;
}

//속성 업데이트
function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인

  for (const [attr, value] of Object.entries(newProps)) {
    //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
    //     다음 속성으로 넘어감 (변경 불필요) + children은 넘어감(속성을 정의하는 것이기 때문.)
    if (Object.is(oldProps[attr], newProps[attr]) || attr === "children") {
      continue;
    }
    //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
    //     target에 해당 속성을 새 값으로 설정
    target.setAttribute(attr, value);
  }

  // oldProps을 반복하여 각 속성 확인
  for (const attr of Object.keys(oldProps)) {
    //   만약 newProps들에 해당 속성이 존재한다면
    //     다음 속성으로 넘어감 (속성 유지 필요)
    if (newProps[attr]) {
      continue;
    }
    //   만약 newProps들에 해당 속성이 존재하지 않는다면
    //     target에서 해당 속성을 제거
    target.removeAttribute(attr);
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  //자식 노드 요소 만들기

  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  if (!newNode && oldNode) {
    const targetNode = parent.childNode[index];
    //   종료

    return parent.removeChild(targetNode);
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    //   종료
    return parent.appendChild(newElement);
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      const newElement = createElement(newNode);
      //   종료
      return parent.replaceChild(newElement, parent.childNodes[index]);
    } else {
      //   종료
      return;
    }
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    //   종료
    return parent.replaceChild(newElement, parent.childNodes[index]);
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  if (newNode.type === oldNode.type) {
    updateAttributes(
      parent.childNodes[index],
      newNode.prop ?? {},
      oldNode.prop ?? {}
    );
  }

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  const newChildren = newNode.prop.children.length
    ? newNode.prop.children
    : [newNode.prop.children];
  const oldChildren = oldNode.prop.children.length
    ? oldNode.prop.children
    : [oldNode.prop.children];

  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    //   각 자식노드에 대해 재귀적으로 render 함수 호출
    //Dfs느낌으로 최하단 children까지 탐색
    render(parent.childNodes[index], newChildren[i], oldChildren[i], i);
  }
}
