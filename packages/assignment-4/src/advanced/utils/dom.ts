export const replaceExistChild = (
  $root: HTMLElement,
  $replacement: DocumentFragment
) => {
  $root.innerHTML = '';
  $root.appendChild($replacement);
};
