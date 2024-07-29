import {
  isEmptyString,
  isNull,
  isUndefined,
  isZeroLengthArray,
} from "@/refactoring/utils/typeNarrowFunctions";
import { describe, expect, test } from "vitest";

const typeNarrowFunctionsTest = () => {
  describe("isNull 함수 테스트 >", () => {
    test("1. null일 때", () => {
      expect(isNull(null)).toBe(true);
    });

    test("2. null이 아닐 때", () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull("null")).toBe(false);
      expect(isNull({})).toBe(false);
    });
  });

  describe("isUndefined 함수 테스트 >", () => {
    test("1. undefined일 때", () => {
      // @ts-expect-error 매개변수가 입력되지 않아서 undefined일 때도 테스트
      expect(isUndefined()).toBe(true);
      expect(isUndefined(undefined)).toBe(true);
    });

    test("2. undefined가 아닐 때", () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined("undefined")).toBe(false);
      expect(isUndefined({})).toBe(false);
    });
  });

  describe("isZeroLengthArray 함수 테스트 >", () => {
    test("1. 빈 배열일 때", () => {
      expect(isZeroLengthArray([])).toBe(true);
    });

    test("2. 요소가 있는 배열일 때", () => {
      expect(isZeroLengthArray([1, 2, 3])).toBe(false);
    });
  });

  describe("isEmptyString 함수 테스트 >", () => {
    test("1. 빈 문자열일 때", () => {
      expect(isEmptyString("")).toBe(true);
    });

    test("2. 빈 문자열이 아닐 때", () => {
      expect(isEmptyString("Hello")).toBe(false);
    });
  });
};

export default typeNarrowFunctionsTest;
