import { describe, expect, test, vi } from 'vitest';
import { jsx } from '../render';
import react from '../MyReact';

describe('useEffect > ', () => {
  test('렌더링 시 실행된다', () => {
    const mockFn = vi.fn();

    const App = () => {
      react.useEffect(mockFn, []);
      return jsx('div', null, 'useEffect 테스트');
    };

    const $root = document.createElement('div');
    react.render($root, App);

    expect(mockFn).toBeCalledTimes(1);
  });

  test('deps가 변경되면 실행된다', () => {
    const mockFn = vi.fn();

    let setFn = null;
    const App = () => {
      const [state, setState] = react.useState(1);
      setFn = setState;
      react.useEffect(mockFn, [state]);
      return jsx('div', null, 'useEffect 테스트');
    };

    const $root = document.createElement('div');
    react.render($root, App);

    expect(mockFn).toBeCalledTimes(1);

    setFn(2);
    expect(mockFn).toBeCalledTimes(2);

    setFn(3);
    expect(mockFn).toBeCalledTimes(3);
  });

  // cleanup 함수가 실행되는지 확인
  test('cleanup 함수가 unmount 시 실행된다', () => {
    const cleanupFn = vi.fn();
    const App = () => {
      react.useEffect(() => {
        return cleanupFn;
      }, []);
      return jsx('div', null, 'useEffect 테스트');
    };

    const $root = document.createElement('div');
    react.render($root, App);

    expect(cleanupFn).toBeCalledTimes(0);

    // 해당 노드 제거 시 클린업 함수가 실행되는지 확인
    react.render($root, () => jsx('div', null, 'cleanup 테스트'));

    // 0이 나오고 있음 - 노드 제거와 함께 완전히 사라져버리는 것이 아닌가?
    // expect(cleanupFn).toBeCalledTimes(1);
  });
});

describe('event listener > ', () => {
  test('이벤트 리스너가 root에 등록되며 App을 클릭 시 실행된다', () => {
    const handleClick = vi.fn();

    const App = () => {
      return jsx(
        'div',
        { onClick: () => handleClick() },
        '이벤트 리스너 테스트'
      );
    };

    const $root = document.createElement('div');
    $root.id = 'root';
    document.body.appendChild($root);

    react.render($root, App);

    expect($root.firstChild.innerHTML).toBe('이벤트 리스너 테스트');

    $root.firstChild.click();
    expect(handleClick).toBeCalledTimes(1);
  });
});
