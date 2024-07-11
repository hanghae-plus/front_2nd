export const createDOMFromLiteral = (literal: string) => {
  return document.createRange().createContextualFragment(literal);
};

export const replaceChildrenFromLiteral = (
  $parentElement: HTMLElement,
  literal: string
) => {
  const $newChildren = createDOMFromLiteral(literal);
  $parentElement.innerHTML = '';
  $parentElement.appendChild($newChildren);
};

export const isDivHTMLElement = (
  targetElement: HTMLElement | null
): targetElement is HTMLDivElement => {
  return targetElement instanceof HTMLDivElement;
};

export const isSelectHTMLElement = (
  targetElement: HTMLElement | null
): targetElement is HTMLSelectElement => {
  return targetElement instanceof HTMLSelectElement;
};

export const isHTMLElement = (
  target: EventTarget | null
): target is HTMLElement => {
  return target instanceof HTMLElement;
};
