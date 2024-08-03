import useEventForm from "@/hooks/useEventForm";
import { RepeatType } from "@/types";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("useEventForm", () => {
  test("form의 각 state의 초기화 테스트", () => {
    const { result } = renderHook(() => useEventForm());

    expect(result.current.editingEvent).toBeNull();
    expect(result.current.title).toBe("");
    expect(result.current.date).toBe("");
    expect(result.current.startTime).toBe("");
    expect(result.current.endTime).toBe("");
    expect(result.current.description).toBe("");
    expect(result.current.location).toBe("");
    expect(result.current.category).toBe("");
    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe("none");
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe("");
    expect(result.current.notificationTime).toBe(10);
    expect(result.current.startTimeError).toBeNull();
    expect(result.current.endTimeError).toBeNull();
  });

  test("form의 각 state의 setState 테스트", () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setTitle("새 이벤트");
      result.current.setDate("2024-08-01");
      result.current.setStartTime("09:00");
      result.current.setEndTime("10:00");
      result.current.setDescription("이벤트 설명");
      result.current.setLocation("장소");
      result.current.setCategory("카테고리");
      result.current.setIsRepeating(true);
      result.current.setRepeatType("daily");
      result.current.setRepeatInterval(2);
      result.current.setRepeatEndDate("2024-12-31");
      result.current.setNotificationTime(15);
    });

    expect(result.current.title).toBe("새 이벤트");
    expect(result.current.date).toBe("2024-08-01");
    expect(result.current.startTime).toBe("09:00");
    expect(result.current.endTime).toBe("10:00");
    expect(result.current.description).toBe("이벤트 설명");
    expect(result.current.location).toBe("장소");
    expect(result.current.category).toBe("카테고리");
    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe("daily");
    expect(result.current.repeatInterval).toBe(2);
    expect(result.current.repeatEndDate).toBe("2024-12-31");
    expect(result.current.notificationTime).toBe(15);
  });

  test("시작 시간보다 종료 시간이 빠른 경우 에러 메시지를 Set합니다.", async () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setStartTime("15:00");
      result.current.setEndTime("14:00");
    });

    await waitFor(() => {
      expect(result.current.startTimeError).toBe(
        "시작 시간은 종료 시간보다 빨라야 합니다."
      );
      expect(result.current.endTimeError).toBe(
        "종료 시간은 시작 시간보다 늦어야 합니다."
      );
    });
  });

  test("시작 시간보다 종료 시간이 늦은 경우 에러 메시지가 null로 set됩니다.", () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setStartTime("14:00");
      result.current.setEndTime("15:00");
    });

    expect(result.current.startTimeError).toBeNull();
    expect(result.current.endTimeError).toBeNull();
  });

  test("필수 입력 사항 누락시 form validation function이 false를 반환합니다.", async () => {
    const { result } = renderHook(() => useEventForm());

    const isValid = await result.current.validateSubmitEventForm();
    expect(isValid).toBe(false);
  });

  test("필수 입력 사항이 입력되어있는 경우 form validation function이 true를 반환합니다.", async () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setTitle("새 이벤트");
      result.current.setDate("2024-08-01");
      result.current.setStartTime("09:00");
      result.current.setEndTime("10:00");
    });

    const isValid = await result.current.validateSubmitEventForm();
    expect(isValid).toBe(true);
  });

  test("resetForm함수 호출시 각 Form의 State가 초기화됩니다.", () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.title).toBe("");
    expect(result.current.date).toBe("");
    expect(result.current.startTime).toBe("");
    expect(result.current.endTime).toBe("");
    expect(result.current.description).toBe("");
    expect(result.current.location).toBe("");
    expect(result.current.category).toBe("");
    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe("none");
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe("");
    expect(result.current.notificationTime).toBe(10);
    expect(result.current.startTimeError).toBeNull();
    expect(result.current.endTimeError).toBeNull();
  });

  test("editingEvent를 Set했을 때 Form의 state들이 editingEvent의 값으로 초기화됩니다.", () => {
    const event = {
      id: 1,
      title: "회의",
      date: "2024-08-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "회의 설명",
      location: "회의실",
      category: "업무",
      repeat: {
        type: "weekly" as RepeatType,
        interval: 1,
        endDate: "2024-12-31",
      },
      notificationTime: 5,
    };

    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.editEvent(event);
    });

    expect(result.current.editingEvent).toEqual(event);
    expect(result.current.title).toBe(event.title);
    expect(result.current.date).toBe(event.date);
    expect(result.current.startTime).toBe(event.startTime);
    expect(result.current.endTime).toBe(event.endTime);
    expect(result.current.description).toBe(event.description);
    expect(result.current.location).toBe(event.location);
    expect(result.current.category).toBe(event.category);
    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe(event.repeat.type);
    expect(result.current.repeatInterval).toBe(event.repeat.interval);
    expect(result.current.repeatEndDate).toBe(event.repeat.endDate || "");
    expect(result.current.notificationTime).toBe(event.notificationTime);
  });
});
