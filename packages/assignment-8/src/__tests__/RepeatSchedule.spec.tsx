import App from "../App";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("반복 유형을 선택할 수 있다.", () => {
  it("일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", async () => {
    render(<App />);
  });
});
