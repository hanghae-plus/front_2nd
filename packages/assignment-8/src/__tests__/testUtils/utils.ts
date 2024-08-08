import { UserEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/react";

export const typeRepeatEvent = async (user: UserEvent, clear?: any) => {
  const titleInput = screen.getByLabelText("제목");
  clear && (await clear(titleInput));
  await user.type(titleInput, "회의");

  const calendarInput = screen.getByLabelText("날짜");
  await user.type(calendarInput, "2024-08-07");

  const startTimeInput = screen.getByLabelText("시작 시간");
  clear && (await clear(startTimeInput));
  await user.type(startTimeInput, "15:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  clear && (await clear(endTimeInput));
  await user.type(endTimeInput, "16:00");

  const descriptionInput = screen.getByLabelText("설명");
  clear && (await clear(descriptionInput));
  await user.type(descriptionInput, "앱 기획 설명");

  const locationInput = screen.getByLabelText("위치");
  clear && (await clear(locationInput));
  await user.type(locationInput, "회의실 1");

  const repeatEventCheckbox = screen.getByRole("repeat-event");
  await user.click(repeatEventCheckbox);

  const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
  await user.selectOptions(repeatEventTypeSelector, "매주");

  const repeatFeqInput = screen.getByLabelText("반복 간격");
  user.clear(repeatFeqInput);
  await user.type(repeatFeqInput, "1");

  const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
  await user.selectOptions(repeatEndCondselect, "날짜");

  const repeatEndDateInput = screen.getByLabelText("반복 종료일");
  await user.type(repeatEndDateInput, "2024-08-29");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};

export const typeThreeDaysRepeatEvent = async (
  user: UserEvent,
  clear?: any,
) => {
  const titleInput = screen.getByLabelText("제목");
  clear && (await clear(titleInput));
  await user.type(titleInput, "회의1");

  const calendarInput = screen.getByLabelText("날짜");
  await user.type(calendarInput, "2024-08-06");

  const startTimeInput = screen.getByLabelText("시작 시간");
  clear && (await clear(startTimeInput));
  await user.type(startTimeInput, "18:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  clear && (await clear(endTimeInput));
  await user.type(endTimeInput, "19:00");

  const descriptionInput = screen.getByLabelText("설명");
  clear && (await clear(descriptionInput));
  await user.type(descriptionInput, "앱 기획 설명");

  const locationInput = screen.getByLabelText("위치");
  clear && (await clear(locationInput));
  await user.type(locationInput, "회의실 1");

  const repeatEventCheckbox = screen.getByRole("repeat-event");
  await user.click(repeatEventCheckbox);

  const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
  await user.selectOptions(repeatEventTypeSelector, "매일");

  const repeatFeqInput = screen.getByLabelText("반복 간격");
  user.clear(repeatFeqInput);
  await user.type(repeatFeqInput, "3");

  const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
  await user.selectOptions(repeatEndCondselect, "날짜");

  const repeatEndDateInput = screen.getByLabelText("반복 종료일");
  await user.type(repeatEndDateInput, "2024-08-29");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};

export const typeRepeatEndEvent = async (user: UserEvent, clear?: any) => {
  const titleInput = screen.getByLabelText("제목");
  clear && (await clear(titleInput));
  await user.type(titleInput, "반복 종료");

  const calendarInput = screen.getByLabelText("날짜");
  await user.type(calendarInput, "2024-08-06");

  const startTimeInput = screen.getByLabelText("시작 시간");
  clear && (await clear(startTimeInput));
  await user.type(startTimeInput, "21:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  clear && (await clear(endTimeInput));
  await user.type(endTimeInput, "22:00");

  const descriptionInput = screen.getByLabelText("설명");
  clear && (await clear(descriptionInput));
  await user.type(descriptionInput, "앱 기획 설명");

  const locationInput = screen.getByLabelText("위치");
  clear && (await clear(locationInput));
  await user.type(locationInput, "회의실 1");

  const repeatEventCheckbox = screen.getByRole("repeat-event");
  await user.click(repeatEventCheckbox);

  const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
  await user.selectOptions(repeatEventTypeSelector, "매일");

  const repeatFeqInput = screen.getByLabelText("반복 간격");
  await user.clear(repeatFeqInput);
  await user.type(repeatFeqInput, "1");

  const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
  await user.selectOptions(repeatEndCondselect, "날짜");

  const repeatEndDateInput = screen.getByLabelText("반복 종료일");
  await user.type(repeatEndDateInput, "2024-08-09");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};

export const typeEndCondCount = async (user: UserEvent) => {
  const titleInput = screen.getByLabelText("제목");
  await user.type(titleInput, "반복 종료 조건");

  const calendarInput = screen.getByLabelText("날짜");
  await user.type(calendarInput, "2024-08-11");

  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.type(startTimeInput, "15:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.type(endTimeInput, "16:00");

  const descriptionInput = screen.getByLabelText("설명");
  await user.type(descriptionInput, "반복 조건으로 횟수를 준다.");

  const locationInput = screen.getByLabelText("위치");
  await user.type(locationInput, "집");

  const repeatEventCheckbox = screen.getByRole("repeat-event");
  await user.click(repeatEventCheckbox);

  const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
  await user.selectOptions(repeatEventTypeSelector, "매일");

  const repeatFeqInput = screen.getByLabelText("반복 간격");
  await user.clear(repeatFeqInput);
  await user.type(repeatFeqInput, "1");

  const repeatEndSelect = screen.getByLabelText("반복 종료 조건");
  await user.selectOptions(repeatEndSelect, "횟수");

  const repeatEndCountInput = screen.getByLabelText("반복 횟수");
  await user.clear(repeatEndCountInput);
  await user.type(repeatEndCountInput, "3");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};

export const editEndCondCount = async (user: UserEvent, clear?: any) => {
  const titleInput = screen.getByLabelText("제목");
  clear && (await clear(titleInput));
  await user.type(titleInput, "반복 일정 수정");

  const calendarInput = screen.getByLabelText("날짜");
  clear && (await clear(calendarInput));
  await user.type(calendarInput, "2024-08-11");

  const startTimeInput = screen.getByLabelText("시작 시간");
  clear && (await clear(startTimeInput));
  await user.type(startTimeInput, "15:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  clear && (await clear(endTimeInput));
  await user.type(endTimeInput, "16:00");

  const descriptionInput = screen.getByLabelText("설명");
  clear && (await clear(descriptionInput));
  await user.type(descriptionInput, "앱 기획 설명");

  const locationInput = screen.getByLabelText("위치");
  clear && (await clear(locationInput));
  await user.type(locationInput, "회의실 1");

  const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
  await user.selectOptions(repeatEventTypeSelector, "매주");

  const repeatFeqInput = screen.getByLabelText("반복 간격");
  await clear(repeatFeqInput);
  await user.type(repeatFeqInput, "1");

  const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
  await user.selectOptions(repeatEndCondselect, "날짜");

  const repeatEndDateInput = screen.getByLabelText("반복 종료일");
  await user.type(repeatEndDateInput, "2024-08-29");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};
