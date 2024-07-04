import { expect, describe, test, vi } from 'vitest';
import { createHooks } from '../hooks.js';

describe('hooks test', () => {
  describe('useState', () => {
    test('useState로 state를 만들 수 있다.', () => {
      function render() {
        const [a] = useState('foo');
        const [b] = useState('bar');

        return `a: ${a}, b: ${b}`;
      }

      const { useState } = createHooks(render);

      expect(render()).toBe(`a: foo, b: bar`);
    });

    test('useState를 여러번 사용해도 상태가 독립적이다.', () => {
      function render() {
        const [a] = useState('foo');
        const [b] = useState('bar');
        const [c] = useState('foo');

        return `a: ${a}, b: ${b}, c: ${c}`;
      }

      const { useState } = createHooks(render);

      expect(render()).toBe(`a: foo, b: bar, c: foo`);
    });

    test('useState의 기본값이 함수일 경우, 함수의 결과값이 사용된다.', () => {
      function render() {
        const [a] = useState(() => 'foo');
        return a;
      }

      const { useState } = createHooks(render);

      expect(render()).toBe('foo');
    });

    test('setState에 함수를 전달하면 이전 상태를 기반으로 새 상태를 계산한다.', () => {
      let renderCount = 0;
      let result = '';

      const render = vi.fn(() => {
        renderCount++;
        const [count, setCount] = useState(0);
        result = `count: ${count}`;
        return setCount;
      });

      const { useState, resetContext } = createHooks(render);

      const setCount = render();
      expect(result).toBe('count: 0');
      expect(renderCount).toBe(1);

      resetContext();
      setCount((prevCount) => prevCount + 1);
      expect(result).toBe('count: 1');
      expect(renderCount).toBe(2);

      resetContext();
      setCount((prevCount) => prevCount + 2);
      expect(result).toBe('count: 3');
      expect(renderCount).toBe(3);

      resetContext();
      setCount(10);
      expect(result).toBe('count: 10');
      expect(renderCount).toBe(4);

      resetContext();
      setCount((prevCount) => prevCount * 2);
      expect(result).toBe('count: 20');
      expect(renderCount).toBe(5);
    });

    test('setState를 실행할 경우, callback이 다시 실행된다.', () => {
      const render = vi.fn(() => {
        const [, setA] = useState('foo');
        return { setA };
      });

      const { useState } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA('test');
      expect(render).toBeCalledTimes(2);
    });

    test('state의 값이 이전과 동일할 경우, 다시 실행되지 않는다.', () => {
      const render = vi.fn(() => {
        const [, setA] = useState('foo');
        return { setA };
      });

      const { useState } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA('test');
      expect(render).toBeCalledTimes(2);

      setA('test');
      expect(render).toBeCalledTimes(2);
    });

    test('hook의 callback이 실행 되기 이전에 resetContext를 실행해야 값이 정상적으로 반영된다.', () => {
      let result = '';
      const render = vi.fn(() => {
        const [a, setA] = useState('foo');
        const [b, setB] = useState('bar');

        result = `a: ${a}, b: ${b}`;

        return { setA, setB };
      });

      const { useState, resetContext } = createHooks(render);

      const { setA, setB } = render();

      expect(result).toBe(`a: foo, b: bar`);

      resetContext();
      setA('foo-change');
      expect(result).toBe(`a: foo-change, b: bar`);

      resetContext();
      setB('bar-change');
      expect(result).toBe(`a: foo-change, b: bar-change`);

      expect(render).toBeCalledTimes(3);
    });
  });

  describe('useMemo', () => {
    test('useMemo로 만들어진 값은 캐싱된다.', () => {
      function getMemo() {
        resetContext();
        return useMemo(() => [], []);
      }

      const { useMemo, resetContext } = createHooks(getMemo);

      const memo1 = getMemo();
      const memo2 = getMemo();

      expect(memo1).toBe(memo2);
    });

    test('useMemo의 값을 변경하고 싶으면, 의존하는 값을 수정해야 한다.', () => {
      function getMemo() {
        resetContext();
        return useMemo(() => [], [param]);
      }

      const { useMemo, resetContext } = createHooks(getMemo);
      let param = 1;

      const memo1 = getMemo();
      param = 2;

      const memo2 = getMemo();
      const memo3 = getMemo();
      expect(memo1).not.toBe(memo2);
      expect(memo2).toBe(memo3);
      param = 3;
      const memo4 = getMemo();
      expect(memo3).not.toBe(memo4);
    });
  });
});
