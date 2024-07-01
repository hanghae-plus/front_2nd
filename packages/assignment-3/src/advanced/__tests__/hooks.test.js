import { expect, describe, test, vi } from 'vitest'
import { createHooks } from '../hooks.js'

const waitOneFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

describe("refactored useState", () => {
    test("setState를 실행할 경우, 1frame 후에 callback이 다시 실행된다.", async () => {
      const render = vi.fn(() => {
        const [, setA] = useState("foo");
        return { setA };
      });

      const { useState } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA("test");
      expect(render).toBeCalledTimes(1);

      await waitOneFrame();
      expect(render).toBeCalledTimes(2);
    });

    test("setState가 동시에 여러번 실행될 경우, 마지막 setState에 대해서만 render가 호출된다.", async () => {
      let currentState = null;
      const render = vi.fn(() => {
        resetContext();
        const [a, setA] = useState("foo");
        currentState = a;
        return { setA };
      });

      const { useState, resetContext } = createHooks(render);

      const { setA } = render();
      expect(render).toBeCalledTimes(1);

      setA("test1");
      setA("test2");
      setA("test3");
      setA("test4");
      setA("test5");
      await waitOneFrame();
      expect(render).toBeCalledTimes(2);
      expect(currentState).toBe('test5');

    });
  });
