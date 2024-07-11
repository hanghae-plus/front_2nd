export const setAttribute = ({ element, attributes }) => {
  Object.keys(attributes).forEach((key) => {
    const attribute = attributes[key];
    if (typeof attribute === "object" && !Array.isArray(attribute)) {
      setAttribute({
        element: element[key],
        attributes: attribute,
      });
    } else {
      element[key] = attribute;
    }
  });
};

export const createDOMElement = ({ name, options }) => {
  const newElement = document.createElement(name);

  if (options) {
    setAttribute({ element: newElement, attributes: options });
  }

  return newElement;
};

export const appendChildElement = ({ parent, children }) => {
  if (!parent) {
    return;
  } // 부모 요소가 null일 때 함수 종료
  children.forEach((child) => {
    parent.appendChild(child);
  });
};

export const appendSelectOptions = ({ select, options }) => {
  options.forEach((option) => {
    const newOption = createDOMElement({
      name: "option",
      options: {
        value: option.id,
        textContent: `${option.name} - ${option.price}원`,
      },
    });

    appendChildElement({ parent: select, children: [newOption] });
  });
};
