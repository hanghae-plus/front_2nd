import { describe, expect, test } from 'vitest'
import { jsx, render } from '../render'
import react from '../MyReact'

describe('MyReact > ', () => {
  describe('렌더링 테스트', () => {
    test('한 개의 태그를 렌더링할 수 있다.', () => {

      const $root = document.createElement('div');

      react.render($root, () => jsx(
        'div',
        null,
        'div의 children 입니다.'
      ));

      expect($root.innerHTML).toBe(`<div>div의 children 입니다.</div>`);
    })

    test('props를 추가할 수 있다.', () => {
      const $root = document.createElement('div');
      react.render($root, () => jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        'div의 children 입니다.'
      ));

      expect($root.innerHTML).toBe(`<div id="test-id" class="test-class">div의 children 입니다.</div>`);
    })

    test('자식 노드를 표현할 수 있다.', () => {
      const $root = document.createElement('div');
      react.render($root, () => jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단'),
      ));

      expect($root.innerHTML).toBe(`<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`);
    })
  })

  describe('hook 사용해보기', () => {

    describe('useState > ', () => {
      test('값을 정의하고 사용할 수 있다.', () => {
        const App = () => {
          const [state] = react.useState(1);
          return jsx(
            'div',
            null,
            `현재 state: ${state}`
          );
        }

        const $root = document.createElement('div');
        react.render($root, App);

        expect($root.innerHTML).toBe(`<div>현재 state: 1</div>`);
      })

      test('값을 업데이트 할 수 있다.', () => {
        let fn = null;
        const App = () => {
          const [size, setSize] = react.useState(1);
          fn = setSize;
          return jsx(
            'div',
            null,
            ...Array.from({ length: size }).map((_, key) => jsx('p', null, `${key + 1}번째 자식`))
          );
        }

        const $root = document.createElement('div');
        react.render($root, App);

        const beforeChildren = [ ...$root.querySelectorAll('p') ];
        expect($root.innerHTML).toBe(`<div><p>1번째 자식</p></div>`);

        fn(2)

        expect($root.innerHTML).toBe(`<div><p>1번째 자식</p><p>2번째 자식</p></div>`);

        fn(3)

        expect($root.innerHTML).toBe(`<div><p>1번째 자식</p><p>2번째 자식</p><p>3번째 자식</p></div>`);
      })
    })
  })
})
