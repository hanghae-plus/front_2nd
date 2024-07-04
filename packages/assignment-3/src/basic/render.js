/**
 * @typedef {Object} JSXElement
 * @property {string|Function} type
 * @property {Object} [props]
 * @property {Array<JSXElement|string>} [children]
 */

/**
 * 토큰 jsx로 변환
 * @param {string| Object} type
 * @param {Object} [props]
 * @param {...(JSXElement|string)} [children]
 * @returns {JSXElement}
 */
export function jsx(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}
/**
 * jsx를 dom으로 변환
 * @param {string | JSXElement} node
 * @returns {Node}
 */
export function createElement(node) {
  // string이면 text node 반환
  if (typeof node === 'string') return document.createTextNode(node);

  const $el = document.createElement(node.type);

  // attr 적재
  Object.entries(node.props || {}).forEach(([attr, value]) => {
    if (!value) return;
    $el.setAttribute(attr, value);
  });

  // children 적재

  node.children.forEach((child) => {
    return $el.appendChild(createElement(child));
  });

  return $el;
}

/**
 * Dom의 attributes 구현.
 * @param {HTMLElement} target
 * @param {Object} newProps
 * @param {Object} oldProps
 */
function updateAttributes(target, newProps, oldProps) {
  // props key list 구현
  const props = new Set([
    ...Object.keys(newProps || {}),
    ...Object.keys(oldProps || {}),
  ]);

  props.forEach((attr) => {
    const newValue = newProps[attr];
    const oldValue = oldProps[attr];
    if (newValue === oldValue) return;
    if (!newValue) return target.removeAttribute(attr);
    target.setAttribute(attr, newValue);
  });
}

/**
 *
 * @param {HTMLElement} parent
 * @param {JSXElement|null} newNode
 * @param {JSXElement|null} [oldNode]
 * @param {number} [index=0]
 */
export function render(parent, newNode, oldNode, index = 0) {
  // target을 찾는 연산을 줄이기 위해 변수선언
  const $oldNode = parent.childNodes[index];

  // !newNode && oldNode일때 oldNode 제거
  if (!newNode && oldNode) return parent.removeChild($oldNode);

  // newNode가 있고 oldNode가 없을때 생성
  if (newNode && !oldNode) return parent.appendChild(createElement(newNode));

  // 둘다 string일때 처리
  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode === oldNode) return;
    $oldNode.text = createElement(newNode);
  }

  //만약 newNode와 oldNode의 타입이 다르다면 oldNode를 newNode로 교체
  if (newNode.type !== oldNode.type)
    return parent.replaceChild(createElement(newNode), $oldNode);

  //attr 세팅
  updateAttributes($oldNode, newNode.props || {}, oldNode.props || {});

  //newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  const maxLen = Math.max(newNode.children.length, oldNode.children.length);
  [...Array(maxLen)].forEach((_, i) =>
    render($oldNode, newNode.children[i], oldNode.children[i], i)
  );
}
