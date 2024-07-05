export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  const $el = document.createElement(node.type);

  Object.entries(node.props ?? {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => $el.setAttribute(attr, value));

  node.children.map(createElement).forEach((child) => $el.appendChild(child));

  return $el;
}

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

export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) return parent.removeChild(parent.childNode[index]);
  if (newNode && !oldNode) return parent.appendChild(createElement(newNode));
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

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
