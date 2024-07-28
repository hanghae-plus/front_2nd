import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { serviceWorker } from "../../mock/worker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

const server = serviceWorker;

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    test.fails("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다");

    test.fails(
      "기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다"
    );
    test.fails("일정을 삭제하고 더 이상 조회되지 않는지 확인한다");
  });

  describe("일정 뷰 및 필터링", () => {
    const user = userEvent.setup();
    beforeAll(() => server.listen());

    afterAll(() => server.close());

    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      render(<App />);

      const selectBox = screen.getByRole("combobox", {
        name: "view",
      }) as HTMLSelectElement;

      await user.selectOptions(selectBox, "week");

      expect(selectBox).toHaveValue("week");
    });

    test.fails("주별 뷰에 일정이 정확히 표시되는지 확인한다");
    test.fails("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.");
    test.fails("월별 뷰에 일정이 정확히 표시되는지 확인한다");
  });

  describe("알림 기능", () => {
    test.fails("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다");
  });

  describe("검색 기능", () => {
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("검색어를 지우면 모든 일정이 다시 표시되어야 한다");
  });

  describe("공휴일 표시", () => {
    test.fails("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다");
    test.fails("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다");
  });

  describe("일정 충돌 감지", () => {
    test.fails("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다");
    test.fails(
      "기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다"
    );
  });
});
