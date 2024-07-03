/**
 * @NOTE
 * jsx 객체를 반환한다.
 */
export function jsx(type, props, ...children) {}

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
  let $el;
  //1.Text => textNode
  //2.나머지 => Element
  if (typeof node === 'string') {
    $el = document.createTextNode(node);
  } else {
    $el = document.createElement(node.type);
  }

  //3. 속성값 세팅
  if (node.props) {
    for (const [attr, value] of Object.entries(node.props)) {
      $el.setAttribute(attr, value);
    }
  }

  //4. children 붙이기
  if (node.children) {
    for (const child of node.children) {
      $el.appendChild(createElement(child));
    }
  }

  return $el;
}

/**
 * @NOTE ReactElement에 Props를 갱신한다.
 * 이전 Props와 새로운 Props를 비교하여 있다면 set, 없다면 delete
 * @param {*} target
 * @param {*} newProps
 * @param {*} oldProps
 */
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

  //3. 변경 되었을 때
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  //4. 속성 갱신
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  //5. 자식노드 재귀
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const MAX = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < MAX; i++) {
    render(parent.childNodes[index], newChildren[i], oldChildren[i], i);
  }
}
