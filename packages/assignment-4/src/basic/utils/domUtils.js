/**
 * HTML 요소를 생성합니다.
 * @param {string} tag - HTML 태그 이름
 * @param {string} [className] - 요소의 클래스 이름
 * @param {string} [id] - 요소의 ID
 * @param {string} [textContent] - 요소의 텍스트 내용
 * @param {string} [value] - 요소의 값 (주로 input 요소에 사용)
 * @returns {HTMLElement} 생성된 HTML 요소
 */
export const createElement = (tag, className, id, textContent, value) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (id) element.id = id;
  if (textContent) element.textContent = textContent;
  if (value) element.value = value;
  return element;
};

/**
 * 버튼 요소를 생성합니다.
 * @param {string} className - 버튼의 클래스 이름
 * @param {string} textContent - 버튼의 텍스트 내용
 * @param {Object} [dataAttributes={}] - 버튼에 추가할 data 속성들
 * @param {string} [id] - 버튼의 ID
 * @returns {HTMLButtonElement} 생성된 버튼 요소
 */
export const createButton = (
  className,
  textContent,
  dataAttributes = {},
  id
) => {
  const button = createElement('button', className, id, textContent);

  for (const [key, value] of Object.entries(dataAttributes)) {
    button.dataset[key] = value;
  }

  return button;
};
