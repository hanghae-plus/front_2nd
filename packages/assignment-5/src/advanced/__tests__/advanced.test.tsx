import { describe, test } from "vitest";
import useFormValidationTest from "./CustomHooksTest/useFormValidationTest";
import useProductFormTest from "./CustomHooksTest/useProductFormTest";
import useToggleTest from "./CustomHooksTest/useToggleTest";
import AdminPageTest from "./ScenarioTest/AdminPageTest";
import CartPageTest from "./ScenarioTest/CartPageTest";
import testName from "./testTemplate";

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

  describe("테스트 템플릿", testName);
});
