import { wonFormatter } from "@/refactoring/utils/currencyFormatter";
import generateErrorMessage from "@/refactoring/utils/generateErrorMessage";
import { generateNewDefaultProduct } from "@/refactoring/utils/generateNewDefaultProduct";
import { describe, expect, test } from "vitest";

const otherUtilsTest = () => {
  describe("generateNewDefaultProduct >", () => {
    test("1. 생성과 Default 값으로의 초기화 기능", () => {
      const product = generateNewDefaultProduct("new ID");
      expect(product).toHaveProperty("id");
      expect(product.id).toBe("new ID");
      expect(product.name).toBe("");
      expect(product.price).toBe(0);
      expect(product.stock).toBe(0);
      expect(product.discounts).toEqual([]);
    });

    test("2. 파라미터를 식별자로 하는 새로운 객체 생성, 식별자가 같아도 참조는 다름", () => {
      const productA = generateNewDefaultProduct("A");
      const productB = generateNewDefaultProduct("B");
      const productC = generateNewDefaultProduct("A");
      expect(productA).not.toBe(productB);
      expect(productA).not.toBe(productC);
    });
  });

  test('wonFormatter > number 값에 세 자리마다 "," 추가 및 단위 붙혀서 반환', () => {
    expect(wonFormatter(1000)).toBe("₩ 1,000");
    expect(wonFormatter(1000000)).toBe("₩ 1,000,000");
    expect(wonFormatter(0)).toBe("₩ 0");
    expect(wonFormatter(-1000)).toBe("₩ -1,000");
    expect(wonFormatter(1000.5)).toBe("₩ 1,000.5");
  });

  test("generateErrorMessage > 입력을 조합해 에러메시지 반환", () => {
    expect(generateErrorMessage.formError("이름")).toBe(
      "이름: 값을 입력해주세요."
    );
    expect(generateErrorMessage.formError("이름", "필수")).toBe(
      "이름: 필수 값을 입력해주세요."
    );
    expect(generateErrorMessage.formError("가격", "정수")).toBe(
      "가격: 정수 값을 입력해주세요."
    );
    expect(generateErrorMessage.formError("상품 가격", "0 이상의")).toBe(
      "상품 가격: 0 이상의 값을 입력해주세요."
    );
  });
};

export default otherUtilsTest;
