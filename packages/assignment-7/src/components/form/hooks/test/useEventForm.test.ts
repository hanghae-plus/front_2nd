import { act, renderHook } from "@testing-library/react";
import { useEventForm } from "../useEventForm";
import { Event } from "../../../../App";
import { ChangeEvent } from "react";

describe("useEventForm", () => {
  const initialFormState = {
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    category: "",
    isRepeating: false,
    repeatType: "none",
    repeatInterval: 1,
    repeatEndDate: "",
    notificationTime: 10,
  };

  const mockEvent: Event = {
    id: 1,
    title: "테스트 이벤트",
    date: "2023-08-01",
    startTime: "10:00",
    endTime: "11:00",
    description: "테스트 설명",
    location: "테스트 장소",
    category: "테스트 카테고리",
    repeat: { type: "daily", interval: 2, endDate: "2023-08-31" },
    notificationTime: 30,
  };

  test("초기 상태를 올바르게 설정한다", () => {
    const { result } = renderHook(() => useEventForm(null));

    expect(result.current.eventFormValue).toEqual(initialFormState);
  });

  test("editingEvent가 제공되면 폼 값을 올바르게 설정한다", () => {
    const { result } = renderHook(() => useEventForm(mockEvent));

    expect(result.current.eventFormValue).toEqual({
      title: "테스트 이벤트",
      date: "2023-08-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "테스트 설명",
      location: "테스트 장소",
      category: "테스트 카테고리",
      isRepeating: true,
      repeatType: "daily",
      repeatInterval: 2,
      repeatEndDate: "2023-08-31",
      notificationTime: 30,
    });
  });

  test("시작 시간과 종료 시간을 올바르게 검증한다", async () => {
    const { result, rerender } = renderHook(() => useEventForm(null));

    act(() => {
      result.current.handleStartTimeChange({
        target: { value: "10:00" },
      } as ChangeEvent<HTMLInputElement>);
      result.current.handleEndTimeChange({
        target: { value: "09:00" },
      } as ChangeEvent<HTMLInputElement>);
    });

    rerender();

    expect(result.current.startTimeError).toBe(
      "시작 시간은 종료 시간보다 빨라야 합니다."
    );
    expect(result.current.endTimeError).toBe(
      "종료 시간은 시작 시간보다 늦어야 합니다."
    );

    act(() => {
      result.current.handleEndTimeChange({
        target: { value: "11:00" },
      } as ChangeEvent<HTMLInputElement>);
    });

    rerender();

    expect(result.current.startTimeError).toBeNull();
    expect(result.current.endTimeError).toBeNull();
  });

  test("resetForm 함수로 form을 초기화 합니다.", () => {
    const { result } = renderHook(() => useEventForm(null));

    act(() => {
      result.current.setEventFormValue({
        title: "테스트",
        date: "2023-08-01",
        startTime: "10:00",
        endTime: "11:00",
        description: "설명",
        location: "장소",
        category: "카테고리",
        isRepeating: true,
        repeatType: "weekly",
        repeatInterval: 2,
        repeatEndDate: "2023-08-31",
        notificationTime: 30,
      });
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.eventFormValue).toEqual(initialFormState);
  });
});
