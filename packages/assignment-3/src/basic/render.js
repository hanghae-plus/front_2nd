/**
 *
 * @param {string} type
 * @param {object} props
 * @param {any[]} children
 * @returns {{ type: string, props: object, children: any[] }}
 */
export function jsx(type, props, ...children) {
  return { type, props, children };
}

/**
 * @param {string | { type: string, props: object, children: any[] }} node
 */
function createElement(node) {
  if (typeof node === 'string') return document.createTextNode(node);

  const element = document.createElement(node.type);

  Object.entries(node?.props ?? {}).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  node.children
    .map(createElement)
    .forEach((child) => element.appendChild(child));

  return element;
}

/**
 *
 * @param {HTMLElement} target
 * @param {object} newProps
 * @param {object} oldProps
 */
function updateAttributes(target, newProps, oldProps) {
  Object.entries(newProps ?? {}).forEach(([key, value]) => {
    if (
      !Object.hasOwn(oldProps ?? {}, key) ||
      !Object.is(value, oldProps[key])
    ) {
      target.setAttribute(key, value);
    }
  });

  Object.entries(oldProps ?? {}).forEach(([key]) => {
    if (!Object.hasOwn(newProps ?? {}, key)) {
      target.removeAttribute(key);
    }
  });
}

/**
 *
 * @param {HTMLElement} parent
 * @param {null | string | { type: string, props: object, children: any[] }=} newNode
 * @param {null | string | { type: string, props: object, children: any[] }=} oldNode
 * @param {number=} index
 */
export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode === oldNode) return;

    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  if (!Object.is(newNode?.type, oldNode?.type)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  const maxLength = getMaxLength(newNode.children, oldNode.children);
  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}

/**
 * @param {any[]=} array1
 * @param {any[]=} array2
 * @returns {number}
 */
function getMaxLength(array1, array2) {
  return Math.max(array1?.length ?? 0, array2?.length ?? 0);
}
