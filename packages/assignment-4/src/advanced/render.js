const setAttributes = (target, attributes) => {
  for (const [key, attribute] of Object.entries(attributes)) {
    if (typeof attribute === 'object') {
      setAttributes(target[key], attribute);
    } else {
      target[key] = attribute;
    }
  }
};

const appendChildElements = (target, ...$child) => {
  return target.append(...$child.flat());
};

const createLayout = (tagName, attributes = {}, $parent) => {
  const $layout = document.createElement(tagName);
  setAttributes($layout, attributes);
  appendChildElements($parent, $layout);
  return $layout;
};
