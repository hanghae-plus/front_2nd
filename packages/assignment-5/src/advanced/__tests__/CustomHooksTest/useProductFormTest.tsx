import useProductForm from "@/refactoring/hooks/useProductForm";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

const useProductFormTest = () => {
  const changeValue = (element: HTMLElement, value: string) => {
    fireEvent.change(element, {
      target: { value },
    });
  };

  const initialProduct = {
    id: "p1",
    name: "Test Product",
    price: 100,
    stock: 50,
    discounts: [],
  };

  const callback = vi.fn();

  const TestComponent = () => {
    const {
      productForm,
      onChangeName,
      onChangePrice,
      onChangeStock,
      submitEditingProduct,
      errorMessage,
    } = useProductForm({ ...initialProduct }, callback);
    return (
      <div>
        <input
          value={productForm.name}
          onChange={onChangeName}
          data-testid="nameInput"
        />
        <input
          value={productForm.price}
          onChange={onChangePrice}
          data-testid="priceInput"
        />
        <input
          value={productForm.stock}
          onChange={onChangeStock}
          data-testid="stockInput"
        />
        <button onClick={submitEditingProduct} data-testid="submitButton">
          제출
        </button>
        <div data-testid="productForm">{JSON.stringify(productForm)}</div>
        <div data-testid="errorMessage">{errorMessage}</div>
      </div>
    );
  };

  test("1. 초기값이 올바르게 설정되는지 확인", () => {
    render(<TestComponent />);
    const $inputName = screen.getByTestId("nameInput") as HTMLInputElement;
    const $inputPrice = screen.getByTestId("priceInput") as HTMLInputElement;
    const $inputStock = screen.getByTestId("stockInput") as HTMLInputElement;
    const $productForm = screen.getByTestId("productForm");

    expect($inputName).toHaveValue(initialProduct.name);
    expect($inputPrice).toHaveValue(initialProduct.price.toString());
    expect($inputStock).toHaveValue(initialProduct.stock.toString());
    expect($productForm).toHaveTextContent(
      JSON.stringify({
        name: initialProduct.name,
        price: initialProduct.price.toString(),
        stock: initialProduct.stock.toString(),
      })
    );
  });

  test("2. HTML Input Element로 입력 반영 여부 테스트 >", () => {
    render(<TestComponent />);
    const $inputName = screen.getByTestId("nameInput") as HTMLInputElement;
    const $inputPrice = screen.getByTestId("priceInput") as HTMLInputElement;
    const $inputStock = screen.getByTestId("stockInput") as HTMLInputElement;
    const $productForm = screen.getByTestId("productForm");

    // 이름 변경 테스트
    changeValue($inputName, "New Name");
    expect($productForm).toHaveTextContent(
      JSON.stringify({ name: "New Name", price: "100", stock: "50" })
    );

    // 가격 변경 테스트
    changeValue($inputPrice, "200");
    expect($productForm).toHaveTextContent(
      JSON.stringify({ name: "New Name", price: "200", stock: "50" })
    );

    // 재고 변경 테스트
    changeValue($inputStock, "150");
    expect($productForm).toHaveTextContent(
      JSON.stringify({ name: "New Name", price: "200", stock: "150" })
    );
  });

  test("3. 잘못된 값으로 제출 시 에러 메시지 확인", async () => {
    render(<TestComponent />);
    const $inputName = screen.getByTestId("nameInput") as HTMLInputElement;
    const $inputPrice = screen.getByTestId("priceInput") as HTMLInputElement;
    const $inputStock = screen.getByTestId("stockInput") as HTMLInputElement;
    const $submitButton = screen.getByTestId("submitButton");
    const $errorMessage = screen.getByTestId("errorMessage");

    changeValue($inputName, "");
    fireEvent.click($submitButton);

    expect(callback).toHaveBeenCalledTimes(0);
    expect($errorMessage).toHaveTextContent("상품명: 값을 입력해주세요.");

    changeValue($inputName, "New Name");
    changeValue($inputPrice, "");
    fireEvent.click($submitButton);

    expect(callback).toHaveBeenCalledTimes(0);
    expect($errorMessage).toHaveTextContent(
      "상품 가격: 0 이상의 값을 입력해주세요."
    );

    changeValue($inputPrice, "10000");
    changeValue($inputStock, "-10");
    fireEvent.click($submitButton);

    expect(callback).toHaveBeenCalledTimes(0);
    expect($errorMessage).toHaveTextContent(
      "상품 재고: 0 이상의 값을 입력해주세요."
    );
  });

  test("4. 올바른 값으로 제출 시 콜백 호출 확인", () => {
    render(<TestComponent />);
    const $inputName = screen.getByTestId("nameInput") as HTMLInputElement;
    const $inputPrice = screen.getByTestId("priceInput") as HTMLInputElement;
    const $inputStock = screen.getByTestId("stockInput") as HTMLInputElement;
    const $submitButton = screen.getByTestId("submitButton");

    changeValue($inputName, "New Name");
    changeValue($inputPrice, "200");
    changeValue($inputStock, "150");
    fireEvent.click($submitButton);
    expect(callback).toHaveBeenCalled;
  });
};

export default useProductFormTest;
