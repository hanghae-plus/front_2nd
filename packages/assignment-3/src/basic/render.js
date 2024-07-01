export function jsx(type, props, ...children) {
  const node = { type, props: props ?? {}, children };

  if (props?.ref) {
    node.ref = props.ref;
  }

  return node;
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.type);

  if (node.ref) {
    node.ref.current = element;
  }

  Object.entries(node.props || {}).forEach(([key, value]) => {
    if (key !== 'ref') {
      element.setAttribute(key, value);
    }
  });

  node.children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

function updateAttributes(target, newProps, oldProps) {
  // body의 첫번째 div를 찾아 $root에 할당 - 테스트에서는 id root가 사용되지 않고 있음, 일반적으로 react 프로젝트 생성 시 id root를 사용함
  const $root = document.querySelector('#root');
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  Object.entries(newProps).forEach(([newKey, newValue]) => {
    if (newKey.startsWith('on') && typeof newValue === 'function') {
      const eventType = newKey.slice(2).toLowerCase();
      if (
        newKey in oldProps &&
        oldProps[newKey].toString() !== newValue.toString()
      ) {
        $root.removeEventListener(eventType, oldProps[newKey]);
      }
      $root.addEventListener(eventType, (event) => {
        if (
          event.target.closest(`[data-event-id="${target.dataset.eventId}"]`)
        ) {
          newValue(event);
        }
      });
      return;
    }
    if (oldProps[newKey] !== newValue) {
      target.setAttribute(newKey, newValue);
    }
  });
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  Object.keys(oldProps).forEach((oldKey) => {
    if (oldKey.startsWith('on') && typeof oldProps[oldKey] === 'function') {
      if (!(oldKey in newProps)) {
        $root.removeEventListener(
          oldKey.slice(2).toLowerCase(),
          oldProps[oldKey]
        );
      }
      return;
    }
    if (!(oldKey in newProps)) {
      target.removeAttribute(oldKey);
    }
  });
}

const createNodeId = () => crypto.randomUUID();

// parent: 부모 노드
// newNode: 신규 노드
// oldNode: 기존(이전) 노드
// index: siblings 중 몇 번째 노드인지
export function render(parent, newNode, oldNode, index = 0) {
  // 1. remove old node
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  // 2. add new node
  if (newNode && !oldNode) {
    const element = createElement(newNode);
    element.dataset.eventId = createNodeId();
    parent.appendChild(element);
    return;
  }

  // 3. textNode의 update
  if (typeof newNode === 'string' || typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      if (typeof newNode === 'string' && typeof oldNode === 'string') {
        parent.childNodes[index].textContent = newNode;
      } else {
        parent.replaceChild(
          typeof newNode === 'string'
            ? document.createTextNode(newNode)
            : createElement(newNode),
          parent.childNodes[index]
        );
      }
    }
    return;
  }

  // 4. update existing node
  if (newNode.type === oldNode.type) {
    const element = parent.childNodes[index];
    element.dataset.eventId = element.dataset.eventId ?? createNodeId();
    updateAttributes(element, newNode.props, oldNode.props);

    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    const maxLength = Math.max(newLength, oldLength);

    Array.from({ length: maxLength }).forEach((_, index) => {
      render(
        element,
        // index와 newLength, oldLength를 비교한다.
        // Why? -> index가 newLength, oldLength보다 크다면 해당 값이 존재하지 않는다는 의미
        // newNode의 children의 index에 해당하는 값이 존재한다면 해당 값을, 존재하지 않는다면 null
        index < newLength ? newNode.children[index] : null,
        // oldNode의 children의 index에 해당하는 값이 존재한다면 해당 값을, 존재하지 않는다면 null
        index < oldLength ? oldNode.children[index] : null,
        index
      );
    });
  } else {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }
}
