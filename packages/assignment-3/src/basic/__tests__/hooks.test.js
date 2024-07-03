import { expect, describe, test, vi } from "vitest";
import { createHooks } from "../hooks.js";

describe("hooks test", () => {
  describe("useState", () => {
    test("useState로 state를 만들 수 있다.", () => {
      function render() {
        const [a] = useState("foo");
        const [b] = useState("bar");
        const [c] = useState("sion");

        return `a: ${a}, b: ${b} c: ${c}`;
      }

      const { useState } = createHooks(render);

      expect(render()).toBe(`a: foo, b: bar c: sion`);
    });

    test("setState를 실행할 경우, callback이 다시 실행된다.", () => {
      const render = vi.fn(() => {
        const [, setA] = useState("foo");
        return { setA };
      });

      const { useState } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA("test");
      expect(render).toBeCalledTimes(2);
    });

    test("state의 값이 이전과 동일할 경우, 다시 실행되지 않는다.", () => {
      const render = vi.fn(() => {
        const [, setA] = useState("foo");
        return { setA };
      });

      const { useState } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA("test");
      expect(render).toBeCalledTimes(2);

      setA("test");
      expect(render).toBeCalledTimes(2);
    });

    test("hook의 callback이 실행 되기 이전에 resetContext를 실행해야 값이 정상적으로 반영된다.", () => {
      let result = "";
      const render = vi.fn(() => {
        const [a, setA] = useState("foo");
        const [b, setB] = useState("bar");

        result = `a: ${a}, b: ${b}`;

        return { setA, setB };
      });

      const { useState, resetContext } = createHooks(render);

      const { setA, setB } = render();

      expect(result).toBe(`a: foo, b: bar`);

      resetContext();
      setA("foo-change");
      expect(result).toBe(`a: foo-change, b: bar`);

      resetContext();
      setB("bar-change");
      expect(result).toBe(`a: foo-change, b: bar-change`);

      expect(render).toBeCalledTimes(3);

      // resetContext를 실행하지 않았을 때 값이 반영되지 않는 것을 테스트
      setB("bar-change123");
      expect(result).not.toBe(`a: foo-change, b: bar-change123`);
    });
  });

  describe("useMemo", () => {
    test("useMemo로 만들어진 값은 캐싱된다.", () => {
      function getMemo() {
        resetContext();
        return useMemo(() => [], []);
      }

      const { useMemo, resetContext } = createHooks(getMemo);

      const memo1 = getMemo();
      const memo2 = getMemo();

      expect(memo1).toBe(memo2);
    });

    test("useMemo의 값을 변경하고 싶으면, 의존하는 값을 수정해야 한다.", () => {
      function getMemo(dependenciesArray) {
        resetContext();
        return useMemo(() => [], dependenciesArray);
      }

      const { useMemo, resetContext } = createHooks(getMemo);
      let param = 1;

      const memo1 = getMemo([param]);
      param = 2;

      const memo2 = getMemo([param]);
      const memo3 = getMemo([param]);
      expect(memo1).not.toBe(memo2);
      expect(memo2).toBe(memo3);
      param = 3;

      const memo4 = getMemo([param]);
      expect(memo3).not.toBe(memo4);

      // 1 -> 2 -> 3 -> 1
      // 다시 param을 1로 지정했을 때 이전 의존성(3)과 다른 값이기 때문에 새로운 값을 반환하여 memo1과 memo5가 다른 것인지?
      param = 1;
      const memo5 = getMemo([param]);
      expect(memo1).not.toBe(memo5);

      // 의존성에 여러개의 값이 있을때 하나라도 변경되지 않으면 캐싱됨
      const memo6 = getMemo([1, 2, 3]);
      const memo7 = getMemo([1, 2, 3]);

      expect(memo6).toBe(memo7);

      // 여러개 의존성 중 한개라도 변경되면 새로운 값을 return
      const memo8 = getMemo([1, 2, 100]);
      expect(memo8).not.toBe(memo6);
    });
  });
});
