// Dom 요소 생성
export const createEl = (type, options) => {
    return  Object.assign(document.createElement(type), options);
}

// 커스텀 appendChild
export const appendChild = (target, inputEl) =>{
    if (Array.isArray(inputEl)) {
        inputEl.forEach(el => target.appendChild(el));
    } else if (inputEl instanceof Node) {
        target.appendChild(inputEl);
    }
}

// class 포함여부 체킹
export const checkClass = (target, className) => {
    return  target.classList.contains(className)
}