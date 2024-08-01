import { describe, test } from "vitest";
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { setupServer } from 'msw/node';
import { mockApiHandlers } from './mockApiHandlers';
import App from '../App';
import {mockEvents} from "./mockEvents.ts";
import dayjs = require("dayjs");

const testData = {
  "title": "테스트 일정",
  "description": "일정추가",
  "location": "테스트 지역",
  "category": "개인",
  "repeat": {
    "type": "weekly",
    "interval": 1
  },
  "notificationTime": 10,
  "date": "2024-08-04",
  "startTime": "20:40",
  "endTime": "21:40"
};
const testData2 = {
  "title": "테스트 일정2",
  "description": "일정추가",
  "location": "테스트 지역",
  "category": "개인",
  "repeat": {
    "type": "weekly",
    "interval": 1
  },
  "notificationTime": 10,
};
const noEventText = '일정 검색검색 결과가 없습니다.'

// Set up mock API server
const server = setupServer(...mockApiHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      render(<App />);


      await userEvent.type(screen.getByLabelText('제목'), testData.title);
      await userEvent.type(screen.getByLabelText('날짜'), testData.date);
      await userEvent.type(screen.getByLabelText('시작 시간'), testData.startTime);
      await userEvent.type(screen.getByLabelText('종료 시간'), testData.endTime);
      await userEvent.type(screen.getByLabelText('설명'), testData.description);
      await userEvent.type(screen.getByLabelText('위치'), testData.location);
      await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData.category]);
      await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [testData.notificationTime.toString()]);
      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.title);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.date);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.startTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.endTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.description);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.location);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.category);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.notificationTime.toString());
      });
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);


      await waitFor(async () => {
        const firstEvent = screen.getByTestId('event-list').children[1].children[0];
        const $editBtn = firstEvent.children[1].children[0]

        await userEvent.click($editBtn);

        await userEvent.type(screen.getByLabelText('제목'), testData.title);
        await userEvent.type(screen.getByLabelText('날짜'), testData.date);
        await userEvent.type(screen.getByLabelText('시작 시간'), testData.startTime);
        await userEvent.type(screen.getByLabelText('종료 시간'), testData.endTime);
        await userEvent.type(screen.getByLabelText('설명'), testData.description);
        await userEvent.type(screen.getByLabelText('위치'), testData.location);
        await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData.category]);
        await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [testData.notificationTime.toString()]);

        await userEvent.click(screen.getByTestId('event-submit-button'));



        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.title);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.date);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.startTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.endTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.description);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.location);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.category);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.notificationTime.toString());
      });
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      render(<App />);

     await waitFor(async () => {
      const $firstEvent = screen.getByTestId('event-list').children[1].children[0];
      const $deleteBtn = $firstEvent.children[1].children[1]

      await userEvent.click($deleteBtn);

       expect(within($firstEvent).queryByText(mockEvents[0].title)).toBeNull();
       expect(within($firstEvent).queryByText(mockEvents[0].description)).toBeNull();
       expect(within($firstEvent).queryByText(mockEvents[0].location)).toBeNull();
     })
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      const $previousBtn = screen.getByLabelText('Previous');
      const $selector = screen.getByLabelText('view');
      await userEvent.selectOptions($selector, ['week']);
      await userEvent.click($previousBtn);

      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(noEventText);
      });
    })

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      const $selector = screen.getByLabelText('view');
      await userEvent.selectOptions($selector, ['week']);

      const $eventList =  screen.getByTestId('event-list')

      await waitFor(async () => {
        expect($eventList.children.length).toBe(mockEvents.length)
      });
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      const previousElement = screen.getByLabelText('Previous');
      await userEvent.click(previousElement);


      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(noEventText);
      });
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      const $eventList =  screen.getByTestId('event-list')

      await waitFor(async () => {
        expect($eventList.children.length).toBe(mockEvents.length)
      });
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      render(<App />);

      const newDate = dayjs().format('YYYY-MM-DD');
      const startTime = dayjs().add(1, 'minute').format('HH:mm');
      const endTime = dayjs().add(2, 'minute').format('HH:mm');

      await userEvent.type(screen.getByLabelText('제목'), testData2.title);
      await userEvent.type(screen.getByLabelText('날짜'), newDate);
      await userEvent.type(screen.getByLabelText('시작 시간'), startTime);
      await userEvent.type(screen.getByLabelText('종료 시간'), endTime);
      await userEvent.type(screen.getByLabelText('설명'), testData2.description);
      await userEvent.type(screen.getByLabelText('위치'), testData2.location);
      await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData2.category]);
      await userEvent.selectOptions(screen.getByLabelText('알림 설정'), ['1']);

      expect(screen.getByLabelText('알림 설정')).toHaveValue('1')

      await userEvent.click(screen.getByTestId('event-submit-button'));


      await waitFor(async () => {
        const $alert = screen.getByTestId('alert')
        expect($alert).toHaveTextContent(`1분 후 ${testData2.title} 일정이 시작됩니다.`);
      })
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(screen.getByTestId('search-input'), testData.title);


      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.title);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.date);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.startTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.endTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.description);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.location);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.category);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.notificationTime.toString());
      })
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      render(<App />);

      await userEvent.clear(screen.getByTestId('search-input'));
      await expect(screen.getByTestId('search-input')).toHaveValue('');

      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.title);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.date);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.startTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.endTime);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.description);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.location);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.category);
        expect(screen.getByTestId('event-list')).toHaveTextContent(testData.notificationTime.toString());
      })
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const previousElement = screen.getByLabelText('Previous');
      for (let i = 0; i < 7; i++) {
        await userEvent.click(previousElement);
      }

      await waitFor(async () => {
        expect(screen.getByTestId('month-view')).toHaveTextContent("신정");
      })
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const previousElement = screen.getByLabelText('Previous');
      for (let i = 0; i < 3; i++) {
        await userEvent.click(previousElement);
      }

      await waitFor(async () => {
        expect(screen.getByTestId('month-view')).toHaveTextContent("어린이날");
      })
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(screen.getByLabelText('제목'), testData.title);
      await userEvent.type(screen.getByLabelText('날짜'), testData.date);
      await userEvent.type(screen.getByLabelText('시작 시간'), testData.startTime);
      await userEvent.type(screen.getByLabelText('종료 시간'), testData.endTime);
      await userEvent.type(screen.getByLabelText('설명'), testData.description);
      await userEvent.type(screen.getByLabelText('위치'), testData.location);
      await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData.category]);
      await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [testData.notificationTime.toString()]);

      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(async () => {
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      })
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(screen.getByLabelText('제목'), "충돌 테스트1");
      await userEvent.type(screen.getByLabelText('날짜'), "2024-08-05");
      await userEvent.type(screen.getByLabelText('시작 시간'), "10:00");
      await userEvent.type(screen.getByLabelText('종료 시간'), "11:00");
      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toHaveTextContent("충돌 테스트1");
        expect(screen.getByTestId('event-list')).toHaveTextContent("2024-08-05");
      });

      await userEvent.type(screen.getByLabelText('제목'), "충돌 테스트2");
      await userEvent.type(screen.getByLabelText('날짜'), "2024-08-04");
      await userEvent.type(screen.getByLabelText('시작 시간'), "10:00");
      await userEvent.type(screen.getByLabelText('종료 시간'), "11:00");
      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toHaveTextContent("충돌 테스트2");
        expect(screen.getByTestId('event-list')).toHaveTextContent("2024-08-04");
      });

      const $editBtn = screen.getByLabelText('Edit event3');
      await userEvent.click($editBtn);
      await userEvent.clear(screen.getByLabelText("날짜"));
      await userEvent.type(screen.getByLabelText('날짜'), "2024-08-05");
      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      });
    });
  });
});

