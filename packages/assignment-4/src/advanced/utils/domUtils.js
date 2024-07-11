/**
 * HTML 문자열을 DOM 노드로 변환합니다.
 * @param {string} htmlString - 변환할 HTML 문자열
 * @returns {Node} 변환된 DOM 노드
 */
export const createNodeFromHTML = (htmlString) => {
  const container = document.createElement('div');

  container.innerHTML = htmlString.trim();

  // 단일 노드인 경우 직접 반환
  if (container.childNodes.length === 1) {
    return container.firstChild;
  }

  // 여러 노드인 경우 DocumentFragment 사용
  const fragment = document.createDocumentFragment();
  while (container.firstChild) {
    fragment.appendChild(container.firstChild);
  }

  return fragment;
};
