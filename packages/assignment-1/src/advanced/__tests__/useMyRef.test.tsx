import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { useMyRef } from "../useMyRef.ts";

beforeEach(() => {
  vi.clearAllMocks();
})

describe('useRef > ', () => {

  test('useRef와 똑같이 동작하는 useMyRef를 만들어서 사용할 수 있다.', () => {
    const refs = new Set();

    const UseMyRefTest = ({ label }: { label: string }) => {
      const [, rerender] = useState({});
      // useRef로 변경해서 테스트하면 통과됩니다. useMyRef를 useRef와 똑같이 동작하도록 구현해보세요.
      const ref = useMyRef<HTMLDivElement>(null);
      refs.add(ref);

      return (
        <div ref={ref}>
          <button onClick={() => rerender({})}>{label}</button>
        </div>
      )
    }


    const { getByText } = render(
      <>
        <UseMyRefTest label="rerender1" />
        <UseMyRefTest label="rerender2" />
      </>
    );

    act(() => {
      fireEvent.click(getByText('rerender1'));
      fireEvent.click(getByText('rerender2'));
    })

    expect(refs.size).toBe(2);
  })
})
