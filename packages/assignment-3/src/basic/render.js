/** jsx는 XML처럼 생긴 구문을 JS로 변환하는 문법.
 * 그래서 jsx 함수는 props로 들어오는 구문들을 해석해서 JS객체를 리턴해야 한다.
 * type : 생성하는 요소의 유형 ('div', 'span' ....)
 * props : 요소의 속성(class, id)
 * children : 요소의 자식 요소. (여러개가 들어올 수 있음.)
 */
export function jsx(type, props, ...children) {

  // props가 null일때 빈 객체 초기화
  props = props || {};
  
  // children 배열을 평탄화하여 props에 추가
  if(children.length > 0){
    // children이 한개일때는 단일 요소로 접근해서 불필요하게 배열로 처리하지 않게 함.
    props.children = children.length === 1? children[0] : children;
  }

  return { type, props }
}
 
/** props로 들어오는 node를 기반으로 JavaScript 객체로부터 DOM 요소로 변환하는 역할
 * 위의 jsx함수의 객체를 해석할때 사용.
 */
export function createElement(node) {
  if(typeof node === 'string'){
    return document.createTextNode(node);
  }

  // node가 객체일때 type에 들어있는 태그 정보에 맞는 element를 생성
  const {type, props} = node;
  const element = document.createElement(type);

  //props가 있는 경우
  if(props){
    Object.keys(props).forEach(key => {
      if(key === 'children'){
        const children = Array.isArray(props.children)? props.children : [props.children];
        children.forEach(child => element.appendChild(createElement(child)));
      }
      //DOM 요소에 이벤트 리스너를 추가
      else if(key.startsWith('on')&&typeof props[key] === 'function'){
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, props[key]);
      }
      //child도 아니고 이벤트도 아닌 다른 속성들 처리
      else{
        element.setAttribute(key, props[key]); // dom요소에 id, class 등 속성을 설정
      }
    })
  }

  return element;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  Object.keys(newProps).forEach(key=>{
    if(key === 'children')return;
    if(newProps[key] !== oldProps[key]){
      target.setAttribute(key, newProps[key]);
    }
  })

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  Object.keys(oldProps).forEach(key => {
    if(key === 'children') return;
    if(oldProps[key]!==newProps[key]){
      target.removeAttribute(key);
    }
  })
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if(!newNode && oldNode){
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if(newNode && !oldNode){
    parent.appendChild(createElement(newNode));
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(typeof newNode==='string' && typeof oldNode === 'string'){
    if(newNode !== oldNode){
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if(newNode.type !== oldNode.type){
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newNodeLength = newNode.props.children ? newNode.props.children.length : 0;
  const oldNodeLength = oldNode.props.children ? oldNode.props.children.length : 0;

  for(let i=0; i<newNodeLength || i<oldNodeLength; i++){
    render(parent.childNodes[index], newNode.props.children[i], oldNode.props.children[i], i);
  }
}
