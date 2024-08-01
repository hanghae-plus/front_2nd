import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tooltip,
  HStack,
  Checkbox,
  Button,
} from '@chakra-ui/react';
import { categories, notificationOptions } from '../constants/constants';
import { Event, RepeatType } from '../types/types';

interface EventFormProps {
  formData: Partial<Event>;
  updateFormdata: <K extends keyof Event>(key: K, value: Event[K]) => void;
  editingEvent: Event | null;
  validateTime: (startTime?: string, endTime?: string) => void;
  timeError: {
    start: string | null;
    end: string | null;
  };
  onSave: () => void;
}

export const EventForm = ({
  formData,
  updateFormdata,
  editingEvent,
  validateTime,
  timeError,
  onSave,
}: EventFormProps) => {
  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={formData.title}
          onChange={(e) => updateFormdata('title', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => updateFormdata('date', e.target.value)}
        />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip
            label={timeError.start}
            isOpen={!!timeError.start}
            placement="top"
          >
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => updateFormdata('startTime', e.target.value)}
              onBlur={() => validateTime(formData.startTime, formData.endTime)}
              isInvalid={!!timeError.start}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip
            label={timeError.end}
            isOpen={!!timeError.end}
            placement="top"
          >
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormdata('endTime', e.target.value)}
              onBlur={() => validateTime(formData.startTime, formData.endTime)}
              isInvalid={!!timeError.end}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={formData.description}
          onChange={(e) => updateFormdata('description', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={formData.location}
          onChange={(e) => updateFormdata('location', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={formData.category}
          onChange={(e) => updateFormdata('category', e.target.value)}
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
          isChecked={formData.repeat?.type !== 'none'}
          onChange={(e) =>
            updateFormdata('repeat', {
              type: e.target.checked ? 'daily' : 'none',
              interval: 1,
              endDate: '',
            })
          }
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={formData.notificationTime}
          onChange={(e) =>
            updateFormdata('notificationTime', Number(e.target.value))
          }
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {formData.repeat && formData.repeat?.type !== 'none' && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={formData.repeat.type}
              onChange={(e) =>
                updateFormdata('repeat', {
                  type: e.target.value as RepeatType,
                  interval: formData.repeat?.interval || 1,
                  endDate: formData.repeat?.endDate || '',
                })
              }
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          <HStack width="100%">
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={formData.repeat.interval}
                onChange={(e) =>
                  updateFormdata('repeat', {
                    type: formData.repeat?.type || 'daily',
                    interval: Number(e.target.value),
                    endDate: formData.repeat?.endDate || '',
                  })
                }
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={formData.repeat.endDate}
                onChange={(e) =>
                  updateFormdata('repeat', {
                    type: formData.repeat?.type || 'daily',
                    interval: formData.repeat?.interval || 1,
                    endDate: e.target.value,
                  })
                }
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button
        data-testid="event-submit-button"
        onClick={onSave}
        colorScheme="blue"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
};
