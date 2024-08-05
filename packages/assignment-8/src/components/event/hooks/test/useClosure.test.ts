import { act, renderHook } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import { useClosure } from "../useClosure";

describe("useClosure", () => {
  test("초기 상태는 false입니다.", () => {
    const { result } = renderHook(() => useClosure());
    expect(result.current.isOpen).toBe(false);
  });

  test("onOpen 호출 시 isOpen이 true가 되어야 합니다.", async () => {
    const { result } = renderHook(() => useClosure());
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  test("onClose 호출 시 isOpen이 false가 되어야 합니다.", () => {
    const { result } = renderHook(() => useClosure());

    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
