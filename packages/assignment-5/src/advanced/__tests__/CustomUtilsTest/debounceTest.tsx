import { debounce } from "@/refactoring/utils/debounce";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const debounceTest = () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("1. 단일 호출시 호출 타이머 설정", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn();

    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalled();
  });

  test("2. 연속 호출시에도 1회만 호출", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(200);
    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(200);
    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("3. 연속 호출시 가장 마지막 호출만 반영", () => {
    let value = "Hello, World!";
    const mockFn = vi.fn((param: string) => {
      value += param;
    });
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("안녕");
    debouncedFn("세상아!");
    debouncedFn("반가워!");

    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(value).toBe("Hello, World!");

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(value).toBe("Hello, World!반가워!");
  });
};

export default debounceTest;
