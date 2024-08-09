import { describe, expect, it } from "vitest";
import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

const repeatType = [
  { name: "매일", value: "daily" },
  { name: "매주", value: "weekly" },
  { name: "매월", value: "monthly" },
  { name: "매년", value: "yearly" },
];

const setup = (component: ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...render(component),
  };
};

describe("반복 유형 선택", () => {
  it("반복 일정을 선택하면 반복 유형 선택란이 노출되며 초기 값은 '매일'로 노출된다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const select = screen.getByLabelText("반복 유형");

    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("daily");
  });

  it.each(repeatType)("반복 유형으로 $name을 선택할 수 있다.", async (type) => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const select = screen.getByLabelText("반복 유형");
    await user.selectOptions(select, type.name);

    expect(select).toHaveValue(type.value);
  });
});

describe("반복 간격 설정", () => {
  it("반복 설정을 선택하면 반복 간격 입력란이 노출되어야 한다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);

    expect(screen.getByLabelText("반복 간격")).toBeInTheDocument();
  });

  it("반복 간격의 기본값은 1로 지정되어있다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const interval = screen.getByLabelText("반복 간격");

    expect(interval).toHaveValue(1);
  });

  it("0이하의 값을 입력할 수 없다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const interval = screen.getByLabelText("반복 간격");

    expect(interval).toHaveAttribute("min", "1");
  });
});

describe("월별 캘린더 반복 일정 표시", () => {
  it("반복 일정을 설정하면 캘린더 뷰에서 반복 일정이 노출된다..", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const date = screen.getByLabelText("날짜");
    await user.type(date, "2024-08-01");

    const repeatEvent = await screen.findAllByTestId("repeat-event");
    expect(repeatEvent[0]).toBeInTheDocument();
  });

  it("반복 일정 설정을 끄면 캘린더 뷰에서 반복 일정을 표시하지 않는다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.dblClick(checkBox);

    await waitFor(() => {
      expect(screen.queryByTestId("repeat-event")).not.toBeInTheDocument();
    });
  });
});

describe("반복 종료일 설정", () => {
  it("반복 설정을 선택하면 반복 종료일 입력란이 노출되어야 한다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);

    expect(screen.getByLabelText("반복 종료일")).toBeInTheDocument();
  });

  it("반복 종료일의 기본값은 없음으로 지정되어있다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const endDate = screen.getByLabelText("반복 종료일");

    expect(endDate).toHaveValue("");
  });

  it("반복 종료일은 일정 시작일 이후여야 한다.", async () => {});

  it("반복 종료일까지 반복 일정이 표시되어야 한다.", async () => {
    const { user } = setup(<App />);

    const checkBox = screen.getByLabelText("반복 설정");
    await user.click(checkBox);
    const date = screen.getByLabelText("날짜");
    await user.type(date, "2024-08-01");
    const endDate = screen.getByLabelText("반복 종료일");
    await user.type(endDate, "2024-08-10");

    const repeatEvent = await screen.findAllByTestId("repeat-event");
    expect(repeatEvent).toHaveLength(10);
  });
});
