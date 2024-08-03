import { describe, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useEventForm from "../hooks/useEventForm";

describe("custom hook 테스트: useEventForm", () => {
  describe("validate 함수", () => {
    test("제목, 날짜 시간 미입력 시 에러 alert", () => {
      const { result } = renderHook(() => useEventForm());

      let message = "";
      try {
        result.current.validate();
      } catch (error) {
        message = String(error);
      }

      expect(message).toBe("필수 정보를 모두 입력해주세요.");
    });

    test("종료 시간이 시작 시간보다 빠를 경우 에러 alert", () => {
      const { result, rerender } = renderHook(() => useEventForm());
      let message = "";

      // 필수 값 입력
      act(() => {
        result.current.handleChange("title", "새 일정");
        result.current.handleChange("date", "2024-08-02");
        result.current.handleChange("startTime", "15:00");
        result.current.handleChange("endTime", "13:00");
      });

      rerender();

      try {
        result.current.validate();
      } catch (error) {
        message = String(error);
      }

      expect(message).toBe("시간 설정을 확인해주세요.");
    });
  });

  describe("setupForEditEvent 함수", () => {
    test("특정 Event를 넘겨주면 해당 Event 값으로 초기화", () => {
      const { result, rerender } = renderHook(() => useEventForm());
      const testEvent = {
        title: "Setup 테스트",
        date: "2024-08-01",
        startTime: "10:00",
        endTime: "11:00",
      };

      // 실행 전
      expect(result.current.eventFormData.title).toBe("");
      expect(result.current.eventFormData.date).toBe("");
      expect(result.current.eventFormData.startTime).toBe("");
      expect(result.current.eventFormData.endTime).toBe("");

      act(() => {
        result.current.setupForEditEvent(testEvent);
      });

      rerender();

      // 실행 후
      expect(result.current.eventFormData.title).toBe("Setup 테스트");
      expect(result.current.eventFormData.date).toBe("2024-08-01");
      expect(result.current.eventFormData.startTime).toBe("10:00");
      expect(result.current.eventFormData.endTime).toBe("11:00");
    });
  });
});
