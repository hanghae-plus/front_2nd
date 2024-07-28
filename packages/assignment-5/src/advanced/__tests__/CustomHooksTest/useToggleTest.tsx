import useToggle from "@/refactoring/hooks/useToggle";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { expect, test } from "vitest";

const useToggleTest = () => {
  const TestComponent = () => {
    const [state, toggleState] = useToggle(true);
    return (
      <div>
        <div data-testid="state">{state.toString()}</div>
        <button onClick={toggleState} data-testid="toggleButton" />
      </div>
    );
  };

  test("1. 초기값 설정 및 toggle 기능 테스트", () => {
    render(<TestComponent />);
    const $state = screen.getByTestId("state");
    const $toggleButton = screen.getByTestId("toggleButton");

    expect($state).toHaveTextContent("true");

    act(() => {
      fireEvent.click($toggleButton);
    });
    expect($state).toHaveTextContent("false");
  });

  test("2. toggleState 함수가 여러 번 호출될 때 상태가 올바르게 반전되는지 테스트", () => {
    render(<TestComponent />);
    const $state = screen.getByTestId("state");
    const $toggleButton = screen.getByTestId("toggleButton");

    expect($state).toHaveTextContent("true");

    act(() => {
      fireEvent.click($toggleButton);
      fireEvent.click($toggleButton);
      fireEvent.click($toggleButton);
    });
    expect($state).toHaveTextContent("false");

    act(() => {
      fireEvent.click($toggleButton);
      fireEvent.click($toggleButton);
    });
    expect($state).toHaveTextContent("false");
  });
};

export default useToggleTest;
