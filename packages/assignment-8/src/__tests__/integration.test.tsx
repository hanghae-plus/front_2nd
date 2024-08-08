import { describe, test } from "vitest";
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { setupServer } from 'msw/node';
import { mockApiHandlers } from './mockApiHandlers';
import App from '../App';
import {mockEvents, testData2 , testData} from "./mockEvents.ts";
import { NO_EVENT_TEXT, NEW_DATE, START_TIME, END_TIME } from "./mockContants.ts";


// [ Set up mock API server ]
const server = setupServer(...mockApiHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// [ FORM type 함수 ]
const typeForm = async (data) => {
  await userEvent.type(screen.getByLabelText('제목'), data.title);
  data.date && await userEvent.type(screen.getByLabelText('날짜'), data.date);
  data.startTime && await userEvent.type(screen.getByLabelText('시작 시간'), data.startTime);
  data.endTime && await userEvent.type(screen.getByLabelText('종료 시간'), data.endTime);
  data.description && await userEvent.type(screen.getByLabelText('설명'), data.description);
  data.location && await userEvent.type(screen.getByLabelText('위치'), data.location);
  data.category && await userEvent.selectOptions(screen.getByLabelText('카테고리'), [data.category]);
  data.notificationTime && await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [data.notificationTime.toString()]);

  if(data.repeat?.type !== "none"){
    data.repeat.type && await userEvent.selectOptions(screen.getByLabelText('반복 유형'), [data.repeat.type]);
    data.repeat.interval && await userEvent.type(screen.getByLabelText('반복 간격'), data.repeat.interval.toString());
    data.repeat.endDate && await userEvent.type(screen.getByLabelText('반복 종료일'), data.repeat.endDate);
  }
}

const clearFrom = async () => {
  await userEvent.clear(screen.getByLabelText("제목"));
  await userEvent.clear(screen.getByLabelText("날짜"));
  await userEvent.clear(screen.getByLabelText("시작 시간"));
  await userEvent.clear(screen.getByLabelText("종료 시간"));
  await userEvent.clear(screen.getByLabelText("설명"));
  await userEvent.clear(screen.getByLabelText("위치"));
  await userEvent.selectOptions(screen.getByLabelText("카테고리"), ["카테고리 선택"]);
  await userEvent.selectOptions(screen.getByLabelText("알림 설정"), ["10"]);
  screen.getByLabelText("반복 유형") &&   await userEvent.selectOptions(screen.getByLabelText("반복 유형"), ["daily"]);
  screen.getByLabelText("반복 간격") &&  await userEvent.type(screen.getByLabelText('반복 간격'), '1');
  screen.getByLabelText("반복 종료일") && await userEvent.clear(screen.getByLabelText("반복 종료일"));
}

// [ Form type check 함수 ]
const checkForm = async (data) => {
  expect(screen.getByTestId('event-list')).toHaveTextContent(data.title);
  data.date &&  expect(screen.getByTestId('event-list')).toHaveTextContent(data.date);
  data.startTime &&  expect(screen.getByTestId('event-list')).toHaveTextContent(data.startTime);
  data.endTime && expect(screen.getByTestId('event-list')).toHaveTextContent(data.endTime);
  data.description && expect(screen.getByTestId('event-list')).toHaveTextContent(data.description);
  data.location && expect(screen.getByTestId('event-list')).toHaveTextContent(data.location);
  data.category && expect(screen.getByTestId('event-list')).toHaveTextContent(data.category);
  data.notificationTime && expect(screen.getByTestId('event-list')).toHaveTextContent(data.notificationTime.toString());

  if(data.repeat?.type !== "none"){
    expect(screen.getByLabelText('repeact-check-box')).toBeChecked();
    const element = screen.queryByLabelText(`${data.title}_repeat`);
    expect(element).not.toBeNull();
  }
}

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      render(<App />);

      // When
      await typeForm(testData)
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // Then
      await waitFor(() => {
        checkForm(testData)
      });
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);

      await waitFor(async () => {
        // Given
        const firstEvent = screen.getByTestId('event-list').children[1].children[0];
        const $editBtn = firstEvent.children[1].children[0]

        // When
        await userEvent.click($editBtn);
        await typeForm(testData)
        await userEvent.click(screen.getByTestId('event-submit-button'));


        // Then
        await checkForm(testData)
      });
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      render(<App />);

      await waitFor(async () => {
        // Given
        const $firstEvent = screen.getByTestId('event-list').children[1].children[0];
        const $deleteBtn = $firstEvent.children[1].children[1]

        // When
        await userEvent.click($deleteBtn);

        // Then
        expect(within($firstEvent).queryByText(mockEvents[0].title)).toBeNull();
        expect(within($firstEvent).queryByText(mockEvents[0].description)).toBeNull();
        expect(within($firstEvent).queryByText(mockEvents[0].location)).toBeNull();
     })
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      // Given
      const $previousBtn = screen.getByLabelText('Previous');
      const $selector = screen.getByLabelText('view');

      // When
      await userEvent.click($previousBtn);
      await userEvent.selectOptions($selector, ['week']);

      // Then
      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(NO_EVENT_TEXT);
      });
    })

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      // Given
      const $selector = screen.getByLabelText('view');
      const $eventList =  screen.getByTestId('event-list')

      // When
      await userEvent.selectOptions($selector, ['week']);

      // Then
      await waitFor(async () => {
        expect($eventList.children.length).toBe(mockEvents.length)
      });
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      // Given
      const previousElement = screen.getByLabelText('Previous');

      // When
      await userEvent.click(previousElement);

      // Then
      await waitFor(async () => {
        expect(screen.getByTestId('event-list')).toHaveTextContent(NO_EVENT_TEXT);
      });
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      // Given
      const $eventList =  screen.getByTestId('event-list')

      // Then
      await waitFor(async () => {
        expect($eventList.children.length).toBe(mockEvents.length)
      });
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      render(<App />);

      // When
      await typeForm(testData2)
      await userEvent.type(screen.getByLabelText('날짜'), NEW_DATE);
      await userEvent.type(screen.getByLabelText('시작 시간'), START_TIME);
      await userEvent.type(screen.getByLabelText('종료 시간'), END_TIME);
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // Then
      await waitFor(async () => {
        await checkForm(testData2)
        await expect(screen.getByTestId('alert')).toHaveTextContent(`1분 후 ${testData2.title} 일정이 시작됩니다.`);
      })
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      // When
      await userEvent.type(screen.getByTestId('search-input'), testData.title);

      // Then
      await waitFor(async () => {
        await checkForm(testData);
      })
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      render(<App />);

      // When
      await userEvent.clear(screen.getByTestId('search-input'));

      // Then
      await waitFor(async () => {
        await expect(screen.getByTestId('search-input')).toHaveValue('');
        await checkForm(testData)
        await checkForm(testData2)
      })
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);
      // Given
      const previousElement = screen.getByLabelText('Previous');

      // When
      for (let i = 0; i < 7; i++) {
        await userEvent.click(previousElement);
      }

      // Then
      await waitFor(async () => {
        expect(screen.getByTestId('month-view')).toHaveTextContent("신정");
      })
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);
      // Given
      const previousElement = screen.getByLabelText('Previous');

      // When
      for (let i = 0; i < 3; i++) {
        await userEvent.click(previousElement);
      }

      // Then
      await waitFor(async () => {
        expect(screen.getByTestId('month-view')).toHaveTextContent("어린이날");
      })
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      // When
      await typeForm(testData)
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // Then
      await waitFor(async () => {
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      })
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);
      const mockData = {
        title: '충돌 테스트',
        date: '2024-08-09',
        startTime: '20:40',
        endTime: '21:40',
        repeat: {
          type: "none",
          interval: 1
        },
      }

      // When
      await typeForm(mockData)
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // Then
      await waitFor(async () => {
        await userEvent.clear(screen.getByLabelText("날짜"));
        await userEvent.type(screen.getByLabelText('날짜'), testData.date);
        await userEvent.click(screen.getByTestId('event-submit-button'));
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      });
    });
  });

  describe('반복일정 체크', () => {
    test('반복 유형과 간격 선택후 반복 일정 표시', async () => {
      render(<App />);

      //given
      const mockData = {
        title: '반복일정',
        date: '2024-08-15',
        startTime: '20:40',
        endTime: '21:40',
        notificationTime: 10,
        repeat: {
          type: "daily",
          interval: 1,
          endDate: "2024-08-20"
        },
      }

      //when
      await userEvent.click(screen.getByLabelText('repeact-check-box'));
      await clearFrom()
      await typeForm(mockData)
      await userEvent.click(screen.getByTestId('event-submit-button'));


      //then
      await waitFor(async () => {
        const list = screen.getByTestId('event-list');
        expect(list.children.length).toBe(5);
      });
    })
  })
});

