# react의 render 구현

## 1. jsx 변환로직 구현

```js
// 구현부
export function jsx(type, props, ...children) {
  return {};
}
```

## 2. 검증

### 2.1 한 개의 태그를 렌더링할 수 있다

```js
test('한 개의 태그를 렌더링할 수 있다.', () => {
  const App = jsx('div', null, 'div의 children 입니다.');

  const $root = document.createElement('div');
  render($root, App);

  expect($root.innerHTML).toBe(`<div>div의 children 입니다.</div>`);
});
```

#### 배경 지식

jsx는 페이스북에서 만들었으며, xml 스타일의 트리구조를 토큰화해 ECMAScript로 변환시켜줍니다.
jsx는 엔진이나 브라우저에서 구현되도록 의도된것은 아니며, 다양한 트랜스파일러를 통해 다양한 속성을 가진 **트리 구조**를 토큰화해 ECMAScript로 변환하여 사용합니다.

#### 구현

`jsx("div", null, "div의 children 입니다.")` 를 넣으면 `<div>div의 children 입니다.</div>`가 나와야 한다.

createElement에 데이터를 넣고, 그 데이터를 토큰화하여 jsx함수로 리턴해주고싶지만. 현재 test코드는 jsx에 데이터를 주입하기때문에 jsx안에서 이 작업을 해결하겠습니다.

```js
//type은 편의상 string | Component로 정의
export function jsx(type, props, ...children) {
  return {};
}
```
