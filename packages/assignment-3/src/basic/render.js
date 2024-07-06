export function jsx(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            //문자 렌더링을 위해 children 길이 확인
            children: children.length === 1 ? children[0] : children,
        },
    };
}

// createElement 함수 구현
export function createElement(node) {
    // 문자열  > 텍스트 노드
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    // 객체 노드는 > DOM 요소로 변환
    const { type, props } = node;
    const element = document.createElement(type);

    // props가 있으면 처리
    if (props) {
        Object.keys(props).forEach((name) => {
            if (name !== "children") {
                element.setAttribute(name, props[name]);
            }
        });

        // 문자배열로 텍스트 생성
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach((child) => element.appendChild(createElement(child)));
    }

    return element;
}

function updateAttributes(target, newProps, oldProps) {
    for (const key in oldProps) {
        if (key !== "children") {
            //   만약 newProps들에 해당 속성이 존재하지 않는다면
            if (!(key in newProps)) {
                //     target에서 해당 속성을 제거
                target.removeAttribute(key);
            }
        }
    }
    for (const key in newProps) {
        if (key !== "children") {
            //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
            if (newProps[key] !== oldProps[key]) {
                //     target에 해당 속성을 새 값으로 설정
                target.setAttribute(key, newProps[key]);
            }
        }
    }
    //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
    //     다음 속성으로 넘어감 (변경 불필요)

    // oldProps을 반복하여 각 속성 확인
    //   만약 newProps들에 해당 속성이 존재한다면
    //     다음 속성으로 넘어감 (속성 유지 필요)
}

export function render(parent, newNode, oldNode, index = 0) {
    // 1. 만약 newNode가 없고 oldNode만 있다면
    //   parent에서 oldNode를 제거
    if (!newNode && oldNode) {
        parent.removeChild(oldNode);
        return;
    }
    //   종료
    // 2. 만약 newNode가 있고 oldNode가 없다면
    //   newNode를 생성하여 parent에 추가
    if (newNode && !oldNode) {
        parent.appendChild(createElement(newNode));
        return;
    }

    //   종료
    // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
    //   oldNode를 newNode로 교체
    if (typeof newNode === "string" && typeof oldNode === "string") {
        if (newNode !== oldNode) {
            parent.replaceChild(createElement(newNode), parent.childNodes[index]);
        }
        return;
    }
    //   종료
    // 4. 만약 newNode와 oldNode의 타입이 다르다면
    //   oldNode를 newNode로 교체
    if (newNode.type !== oldNode.type) {
        parent.replaceChild(createElement(newNode), parent.childNodes[index]);
        return;
    }
    //   종료
    // 5. newNode와 oldNode에 대해 updateAttributes 실행
    updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

    // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
    const newLength = newNode.props.children
        ? Array.isArray(newNode.props.children)
            ? newNode.props.children.length
            : 1
        : 0;
    const oldLength = oldNode.props.children
        ? Array.isArray(oldNode.props.children)
            ? oldNode.props.children.length
            : 1
        : 0;
    const maxLength = Math.max(newLength, oldLength);

    //   각 자식노드에 대해 재귀적으로 render 함수 호출
    for (let i = 0; i < maxLength; i++) {
        render(
            parent.childNodes[index],
            newNode.props.children
                ? Array.isArray(newNode.props.children)
                    ? newNode.props.children[i]
                    : newNode.props.children
                : null,
            oldNode.props.children
                ? Array.isArray(oldNode.props.children)
                    ? oldNode.props.children[i]
                    : oldNode.props.children
                : null,
            i
        );
    }
}
