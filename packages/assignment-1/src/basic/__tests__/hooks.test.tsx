import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as useMemoTestUtils from '../UseMemoTest.utils.ts';
import UseMemoTest from "../UseMemoTest.tsx";
import UseStateTest from "../UseStateTest.tsx";
import PureComponentTest from "../PureComponentTest.tsx";
import * as UseCallbackTestUtils from '../UseCallbackTest.utils.tsx';
import UseCallbackTest from "../UseCallbackTest.tsx";
import { useState } from "react";
import RequireRefactoring from "../RequireRefactoring.tsx";

beforeEach(() => {
  vi.clearAllMocks();
})

describe('다양한 hook을 이용하여 테스트코드를 통과할 수 있도록 해봅시다.', () => {
  describe('useState > ', () => {
    test('setState의 내용을 개선하여, 증가 버튼을 누르면 count의 값이 증가하도록 한다.', () => {
      render(<UseStateTest/>);

      expect(document.body.innerHTML).toBe('<div><div>count: 1<button>증가</button></div></div>');

      act(() => {
        fireEvent.click(screen.getByText('증가'))
      })

      expect(document.body.innerHTML).toBe('<div><div>count: 2<button>증가</button></div></div>');
    })
  })

  describe('useMemo, memo > ', () => {
    test('useMemo를 사용하여 불필요한 값 연산을 방지한다.', async () => {
      const spyRepeatMeow = vi.spyOn(useMemoTestUtils, 'repeatMeow');
      const spyRepeatBarked = vi.spyOn(useMemoTestUtils, 'repeatBarked');

      const { findByTestId } = render(<UseMemoTest/>);

      const $cat = await findByTestId('cat');
      const $dog = await findByTestId('dog');
      const $meowHandler = await findByTestId('meow');
      const $barkHandler = await findByTestId('bark');
      expect($cat.innerHTML).toBe('고양이 "냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($meowHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($barkHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍멍"');

      expect(spyRepeatMeow).toHaveBeenCalledTimes(2);
      expect(spyRepeatBarked).toHaveBeenCalledTimes(2);
    })

    test('PureComponent를 사용하여 불필요한 렌더링을 방지한다.', async () => {
      const spyRepeatMeow = vi.spyOn(useMemoTestUtils, 'repeatMeow');
      const spyRepeatBarked = vi.spyOn(useMemoTestUtils, 'repeatBarked');

      const { findByTestId } = render(<PureComponentTest/>);

      const $cat = await findByTestId('cat');
      const $dog = await findByTestId('dog');
      const $meowHandler = await findByTestId('meow');
      const $barkHandler = await findByTestId('bark');
      expect($cat.innerHTML).toBe('고양이 "냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($meowHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($barkHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍멍"');

      expect(spyRepeatMeow).toHaveBeenCalledTimes(2);
      expect(spyRepeatBarked).toHaveBeenCalledTimes(2);
    })
  })

  describe('useCallback, memo > ', () => {
    test('useCallback과 PureComponent를 사용하여 불필요한 렌더링을 방지한다.', async () => {
      const spyCallMeow = vi.spyOn(UseCallbackTestUtils, 'callMeow');
      const spyCallBark = vi.spyOn(UseCallbackTestUtils, 'callBark');

      const { findByTestId } = render(<UseCallbackTest/>);

      const $cat = await findByTestId('cat');
      const $dog = await findByTestId('dog');
      const $meowHandler = await findByTestId('meow');
      const $barkHandler = await findByTestId('bark');
      expect($cat.innerHTML).toBe('meowCount 0');
      expect($dog.innerHTML).toBe('barkedCount 0');

      act(() => {
        fireEvent.click($meowHandler);
      })

      expect($cat.innerHTML).toBe('meowCount 1');
      expect($dog.innerHTML).toBe('barkedCount 0');

      act(() => {
        fireEvent.click($barkHandler);
      })

      expect($cat.innerHTML).toBe('meowCount 1');
      expect($dog.innerHTML).toBe('barkedCount 1');

      expect(spyCallMeow).toHaveBeenCalledTimes(1);
      expect(spyCallBark).toHaveBeenCalledTimes(1);
    })
  })

  describe('Props 최적화 >', () => {
    test('useMemo나 useCallback을 사용하지 않고 props를 최적화하여 리렌더링을 방지할 수 있다', () => {
      const countRendering = vi.fn();
      const TestComponent = () => {
        const [, rerender] = useState({});
        return (
          <div>
            <RequireRefactoring countRendering={countRendering}/>
            <button onClick={() => rerender({})}>rerender</button>
          </div>
        )
      }

      const { getByText } = render(<TestComponent/>);

      expect(countRendering).toHaveBeenCalledTimes(1);

      fireEvent.click(getByText('rerender'))
      fireEvent.click(getByText('rerender'))
      fireEvent.click(getByText('rerender'))
      fireEvent.click(getByText('rerender'))
      fireEvent.click(getByText('rerender'))

      expect(countRendering).toHaveBeenCalledTimes(1);
    })
  })
})
