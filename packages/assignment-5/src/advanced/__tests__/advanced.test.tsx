import { describe, test } from "vitest";
import useFormValidationTest from "./CustomHooksTest/useFormValidationTest";
import useProductFormTest from "./CustomHooksTest/useProductFormTest";
import useToggleTest from "./CustomHooksTest/useToggleTest";
import cartUtilAdditionalTest from "./CustomUtilsTest/cartUtilsAdditionalTest";
import debounceTest from "./CustomUtilsTest/debounceTest";
import otherUtilsTest from "./CustomUtilsTest/otherUtilsTest";
import typeNarrowFunctionsTest from "./CustomUtilsTest/typeNarrowFunctionsTest";
import AdminPageTest from "./ScenarioTest/AdminPageTest";
import CartPageTest from "./ScenarioTest/CartPageTest";

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", CartPageTest);
    test("관리자 페이지 테스트 > ", AdminPageTest);
  });

  describe("Custom Hook 테스트 >", () => {
    describe("useToggle 테스트 >", useToggleTest);
    describe("useFormValidation 테스트 >", useFormValidationTest);
    describe("useProductForm 테스트 >", useProductFormTest);
  });

  describe("Custom Utils 테스트 >", () => {
    describe("cartUtils 추가 구현 테스트 >", cartUtilAdditionalTest);
    describe("typeNarrowFunctions 테스트 >", typeNarrowFunctionsTest);
    describe("debounce 테스트 >", debounceTest);
    describe("기타 유틸 함수들 테스트 >", otherUtilsTest);
  });
});
