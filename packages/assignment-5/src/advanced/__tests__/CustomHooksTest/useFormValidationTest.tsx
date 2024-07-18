import useFormValidation, {
  VALIDATION_CONDITIONS,
} from "@/refactoring/hooks/useFormValidation";
import { fireEvent, render, screen } from "@testing-library/react";
import { act, useState } from "react";
import { expect, test } from "vitest";

const useFormValidationTest = () => {
  const changeStringAct = (value: string) => {
    act(() => {
      fireEvent.change(screen.getByTestId("input"), {
        target: { value },
      });
    });
  };

  const TestComponent = () => {
    const [inputString, setInputString] = useState("");

    const [isNotEmpty] = useFormValidation(
      VALIDATION_CONDITIONS.isNotEmpty,
      inputString
    );

    const [isPositiveNumber] = useFormValidation(
      VALIDATION_CONDITIONS.isPositiveNumber,
      inputString
    );

    const [isRate] = useFormValidation(
      VALIDATION_CONDITIONS.isRate,
      inputString
    );

    return (
      <div>
        <div data-testid="isNotEmpty">{isNotEmpty.toString()}</div>
        <div data-testid="isPositiveNumber">{isPositiveNumber.toString()}</div>
        <div data-testid="isRate">{isRate.toString()}</div>
        <input
          data-testid="input"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        />
      </div>
    );
  };

  test("1. isNotEmpty 기능 확인: 비어있지 않을 때 true 반환", () => {
    render(<TestComponent />);
    const $isNotEmpty = screen.getByTestId("isNotEmpty");
    expect($isNotEmpty).toHaveTextContent("false");
    changeStringAct("test");
    expect($isNotEmpty).toHaveTextContent("true");
  });

  test("2. isPositiveNumber 기능 확인: 양수일 때 true 반환", () => {
    render(<TestComponent />);
    const $isPositiveNumber = screen.getByTestId("isPositiveNumber");
    expect($isPositiveNumber).toHaveTextContent("false");
    changeStringAct("100");
    expect($isPositiveNumber).toHaveTextContent("true");
    changeStringAct("0");
    expect($isPositiveNumber).toHaveTextContent("false");
    changeStringAct("100");
    expect($isPositiveNumber).toHaveTextContent("true");
    changeStringAct("-1");
    expect($isPositiveNumber).toHaveTextContent("false");
    changeStringAct("abc");
    expect($isPositiveNumber).toHaveTextContent("false");
  });

  test("3. isRate 기능 확인: 0이상 100이하의 숫자일 때 true 반환", () => {
    render(<TestComponent />);
    const $isRate = screen.getByTestId("isRate");
    expect($isRate).toHaveTextContent("false");
    changeStringAct("100");
    expect($isRate).toHaveTextContent("true");
    changeStringAct("0");
    expect($isRate).toHaveTextContent("true");
    changeStringAct("200");
    expect($isRate).toHaveTextContent("false");
    changeStringAct("0.5");
    expect($isRate).toHaveTextContent("true");
    changeStringAct("-1");
    expect($isRate).toHaveTextContent("false");
    changeStringAct("abc");
    expect($isRate).toHaveTextContent("false");
  });
};

export default useFormValidationTest;
