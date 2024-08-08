import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  useToast,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Text,
  RadioGroup,
  Radio,
  InputGroup,
  InputRightAddon,
  Stack,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useEventForm } from "./hooks/useEventForm";
import { useSaveEvent } from "../hooks/useSaveEvent";
import { Event, RepeatType } from "../../../types/types";
import {
  findOverlappingEvents,
  getRepeatEvents,
} from "../../../utils/date-utils";
import { useClosure } from "../hooks/useClosure";

const categories = ["업무", "개인", "가족", "기타"];

const notificationOptions = [
  { value: 1, label: "1분 전" },
  { value: 10, label: "10분 전" },
  { value: 60, label: "1시간 전" },
  { value: 120, label: "2시간 전" },
  { value: 1440, label: "1일 전" },
];

interface EventFormProps {
  events: Event[];
  fetchEvents: () => Promise<void>;
  editingEvent: Event | null;
}

const EventForm = ({ events, fetchEvents, editingEvent }: EventFormProps) => {
  // 수정 및 삭제 관심사

  const { saveEvent } = useSaveEvent(fetchEvents);

  // 수정하기 관심사
  const [isEditingMode, setIsEditingMode] = useState(false);

  useEffect(() => {
    setIsEditingMode(!!editingEvent);
  }, [editingEvent]);

  // form 관련 로직
  const {
    eventFormValue,
    setEventFormValue,
    handleEndTimeChange,
    handleStartTimeChange,
    startTimeError,
    endTimeError,
    validateTime,
    resetForm,
  } = useEventForm(editingEvent);

  const toast = useToast();

  // form을 제출했을때
  const addOrUpdateEvent = async () => {
    const {
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeatNumber,
      isRepeating,
      repeatEndDate,
      repeatInterval,
      repeatType,
      repeatDay,
      notificationTime,
    } = eventFormValue;

    if (!title || !date || !startTime || !endTime) {
      toast({
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    validateTime(startTime, endTime);
    if (startTimeError || endTimeError) {
      toast({
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: repeatType || "none",
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
        repeatNumber: repeatNumber || undefined,
        repeatDay: repeatDay || undefined,
      },
      notificationTime,
    };

    if (isRepeating) {
      const newRepeatEvents = getRepeatEvents(eventData);
      await saveEvent(newRepeatEvents);
      resetForm();
      return;
    }

    const overlapping = findOverlappingEvents(events, eventData);

    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      onOpen();
    } else {
      await saveEvent(eventData, editingEvent);
      setIsEditingMode(false);
      resetForm();
    }
  };

  // 중복 관련
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const { isOpen, onOpen, onClose } = useClosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 반복 정보 관련
  const [repeatCondition, setRepeatCondition] = useState("1");

  // 등록 날짜의 요일
  const dayData = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayData[new Date(eventFormValue.date).getDay()];

  return (
    <>
      <VStack w="400px" spacing={5} align="stretch">
        <Heading>{isEditingMode ? "일정 수정" : "일정 추가"}</Heading>

        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            data-cy="title"
            value={eventFormValue.title}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  title: e.target.value,
                };
              })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>날짜</FormLabel>
          <Input
            data-cy="date"
            type="date"
            value={eventFormValue.date}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  date: e.target.value,
                };
              })
            }
          />
        </FormControl>

        <HStack width="100%">
          <FormControl>
            <FormLabel>시작 시간</FormLabel>
            <Tooltip
              label={startTimeError}
              isOpen={!!startTimeError}
              placement="top"
            >
              <Input
                data-cy="start-time"
                type="time"
                value={eventFormValue.startTime}
                onChange={handleStartTimeChange}
                onBlur={() =>
                  validateTime(eventFormValue.startTime, eventFormValue.endTime)
                }
                isInvalid={!!startTimeError}
              />
            </Tooltip>
          </FormControl>
          <FormControl>
            <FormLabel>종료 시간</FormLabel>
            <Tooltip
              label={endTimeError}
              isOpen={!!endTimeError}
              placement="top"
            >
              <Input
                data-cy="end-time"
                type="time"
                value={eventFormValue.endTime}
                onChange={handleEndTimeChange}
                onBlur={() =>
                  validateTime(eventFormValue.startTime, eventFormValue.endTime)
                }
                isInvalid={!!endTimeError}
              />
            </Tooltip>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>설명</FormLabel>
          <Input
            data-cy="description"
            value={eventFormValue.description}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  description: e.target.value,
                };
              })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>위치</FormLabel>
          <Input
            data-cy="location"
            value={eventFormValue.location}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  location: e.target.value,
                };
              })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            data-cy="category"
            value={eventFormValue.category}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  category: e.target.value,
                };
              })
            }
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>반복 설정</FormLabel>
          <Checkbox
            isChecked={eventFormValue.isRepeating}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  isRepeating: e.target.checked,
                };
              })
            }
          >
            반복 일정
          </Checkbox>
        </FormControl>

        <FormControl>
          <FormLabel>알림 설정</FormLabel>
          <Select
            value={eventFormValue.notificationTime}
            onChange={(e) =>
              setEventFormValue((formValue) => {
                return {
                  ...formValue,
                  notificationTime: Number(e.target.value),
                };
              })
            }
          >
            {notificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {eventFormValue.isRepeating && (
          <VStack width="100%">
            <FormControl>
              <FormLabel>반복 유형</FormLabel>
              <Select
                value={eventFormValue.repeatType}
                onChange={(e) =>
                  setEventFormValue((formValue) => {
                    return {
                      ...formValue,
                      repeatType: e.target.value as RepeatType,
                    };
                  })
                }
              >
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
                <option value="yearly">매년</option>
              </Select>
            </FormControl>
            {eventFormValue.repeatType === "weekly" && (
              <CheckboxGroup
                defaultValue={[day]}
                onChange={(checkedDayValue) => {
                  setEventFormValue((formValue) => {
                    return {
                      ...formValue,
                      repeatDay: checkedDayValue as string[],
                    };
                  });
                }}
              >
                <Stack direction={["column", "row"]}>
                  {dayData.map((day) => {
                    return (
                      <Checkbox key={day} value={day}>
                        {day}
                      </Checkbox>
                    );
                  })}
                </Stack>
              </CheckboxGroup>
            )}
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={eventFormValue.repeatInterval}
                onChange={(e) =>
                  setEventFormValue((formValue) => {
                    return {
                      ...formValue,
                      repeatInterval: Number(e.target.value),
                    };
                  })
                }
                min={1}
              />
            </FormControl>
            <VStack width="100%">
              <RadioGroup
                gap="5px"
                w="100%"
                onChange={(value) => {
                  setRepeatCondition(value);
                  setEventFormValue((formValue) => {
                    return {
                      ...formValue,
                      repeatEndDate: "",
                      repeatNumber: "",
                    };
                  });
                }}
              >
                <Stack direction="row">
                  <Radio value="1">없음(금년까지)</Radio>
                  <Radio value="2">날짜(종료일)</Radio>
                  <Radio value="3">횟수</Radio>
                </Stack>
              </RadioGroup>
              {repeatCondition === "2" && (
                <FormControl>
                  <FormLabel>반복 종료일</FormLabel>
                  <Input
                    type="date"
                    value={eventFormValue.repeatEndDate}
                    onChange={(e) =>
                      setEventFormValue((formValue) => {
                        return {
                          ...formValue,
                          repeatEndDate: e.target.value,
                        };
                      })
                    }
                  />
                </FormControl>
              )}
              {repeatCondition === "3" && (
                <FormControl>
                  <FormLabel>반복 횟수</FormLabel>
                  <InputGroup>
                    <Input
                      value={eventFormValue.repeatNumber}
                      onChange={(e) =>
                        setEventFormValue((formValue) => {
                          return {
                            ...formValue,
                            repeatNumber: e.target.value,
                          };
                        })
                      }
                    />
                    <InputRightAddon>회 반복</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            </VStack>
          </VStack>
        )}

        <Button
          data-cy="submit-button"
          data-testid="event-submit-button"
          onClick={addOrUpdateEvent}
          colorScheme="blue"
        >
          {editingEvent ? "일정 수정" : "일정 추가"}
        </Button>
      </VStack>

      {/* 중복 일정에 대한 Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              일정 겹침 경고
            </AlertDialogHeader>

            <AlertDialogBody>
              다음 일정과 겹칩니다:
              {overlappingEvents.map((event) => (
                <Text key={event.id}>
                  {event.title} ({event.date} {event.startTime}-{event.endTime})
                </Text>
              ))}
              계속 진행하시겠습니까?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => onClose()}>
                취소
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  const {
                    title,
                    date,
                    startTime,
                    endTime,
                    description,
                    location,
                    category,
                    isRepeating,
                    repeatEndDate,
                    repeatInterval,
                    repeatType,
                    notificationTime,
                  } = eventFormValue;
                  onClose();
                  saveEvent(
                    {
                      id: editingEvent ? editingEvent.id : Date.now(),
                      title,
                      date,
                      startTime,
                      endTime,
                      description,
                      location,
                      category,
                      repeat: {
                        type: isRepeating ? repeatType : "none",
                        interval: repeatInterval,
                        endDate: repeatEndDate || undefined,
                      },
                      notificationTime,
                    },
                    editingEvent
                  );
                }}
                ml={3}
              >
                계속 진행
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EventForm;
