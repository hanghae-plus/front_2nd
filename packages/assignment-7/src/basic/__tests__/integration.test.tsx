// src/basic/__test__/integration.test.tsx
 
import { afterEach, beforeEach, describe, expect, it, vi, test } from "vitest"; 
import { render, screen, waitFor, within, prettyDOM  } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from 'msw/node';
import { mockApiHandlers, resetMockEvents } from './mockApiHandlers';
import { mockEvents } from "./mockEvents.ts";
import App from '../../App';
import dayjs = require("dayjs");


// Set up mock API server
const server = setupServer(...mockApiHandlers);
const mockToastFn = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => mockToastFn,
  };
});


// 여러번 사용된 테스트 캐이스 
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
const noEventText = '검색 결과가 없습니다.'

beforeAll(() => server.listen());
beforeEach(() => {
  resetMockEvents();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('일정 관리 애플리케이션 통합 테스트', () => {
  afterEach(() => {
    resetMockEvents();
    vi.useRealTimers();
  });

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
 
      await waitFor(() => {
        expect(screen.getByTestId('event-list').children.length).toBeGreaterThan(1);
      });
    
      try {
        const eventList = screen.getByTestId('event-list'); 
        const firstEvent = eventList.children[1].children[0];
        
        const $editBtn = within(firstEvent).getByRole('button', { name: /edit/i });
    
        await userEvent.click($editBtn);
    
        await userEvent.clear(screen.getByLabelText('제목'));
        await userEvent.type(screen.getByLabelText('제목'), testData.title);
        await userEvent.clear(screen.getByLabelText('날짜'));
        await userEvent.type(screen.getByLabelText('날짜'), testData.date);
        await userEvent.clear(screen.getByLabelText('시작 시간'));
        await userEvent.type(screen.getByLabelText('시작 시간'), testData.startTime);
        await userEvent.clear(screen.getByLabelText('종료 시간'));
        await userEvent.type(screen.getByLabelText('종료 시간'), testData.endTime);
        await userEvent.clear(screen.getByLabelText('설명'));
        await userEvent.type(screen.getByLabelText('설명'), testData.description);
        await userEvent.clear(screen.getByLabelText('위치'));
        await userEvent.type(screen.getByLabelText('위치'), testData.location);
        await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData.category]);
        await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [testData.notificationTime.toString()]);
    
        await userEvent.click(screen.getByTestId('event-submit-button'));
    
        // 변경사항이 반영되었는지 확인
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
      } catch (error) {
        console.error('Test failed:', error);
        console.log('Current DOM:', prettyDOM(document.body));
        throw error;
      }
    
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
     
      const $eventList = screen.getByTestId('event-list'); 
 
      try {
        await waitFor(() => {
          console.log('mockEvents length:', mockEvents.length);
          console.log('Rendered events length:', $eventList.children.length);

          const renderedEvents = Array.from($eventList.children).filter(
            child => !child.textContent.includes('일정 검색')
          );
    
          // 렌더링된 이벤트의 내용을 출력
          Array.from($eventList.children).forEach((child, index) => {
            console.log(`Event ${index + 1}:`, child.textContent);
          });

          expect(renderedEvents.length).toBe(mockEvents.length);
        }, { timeout: 3000 }); // 3초로 타임아웃 설정
      } catch (error) {
        console.error('Error during waitFor:', error);
        throw error;
      }
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

      await userEvent.type(screen.getByLabelText('제목'), testData.title);
      await userEvent.type(screen.getByLabelText('날짜'), testData.date);
      await userEvent.type(screen.getByLabelText('시작 시간'), testData.startTime);
      await userEvent.type(screen.getByLabelText('종료 시간'), testData.endTime);
      await userEvent.type(screen.getByLabelText('설명'), testData.description);
      await userEvent.type(screen.getByLabelText('위치'), testData.location);
      await userEvent.selectOptions(screen.getByLabelText('카테고리'), [testData.category]);
      await userEvent.selectOptions(screen.getByLabelText('알림 설정'), [testData.notificationTime.toString()]);
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // SEARCH
      await userEvent.type(screen.getByTestId('search-input'), testData.title);


      try {
        await waitFor(() => {
          const eventList = screen.getByTestId('event-list');
          console.log(eventList.innerHTML); // 디버깅을 위한 출력
          expect(eventList).toHaveTextContent(testData.title);
          expect(eventList).toHaveTextContent(testData.date);
          expect(eventList).toHaveTextContent(testData.startTime);
          expect(eventList).toHaveTextContent(testData.endTime);
          expect(eventList).toHaveTextContent(testData.description);
          expect(eventList).toHaveTextContent(testData.location);
          expect(eventList).toHaveTextContent(testData.category);
          expect(eventList).toHaveTextContent(testData.notificationTime.toString());
        }, { timeout: 2000 }); 
      } catch (error) {
        console.error('Error during waitFor:', error);
        throw error;
      }
    });

    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {  
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

 
      const view = await screen.getByTestId("event-list"); 
      const searchInput = screen.getByLabelText(/일정 검색/);
      await userEvent.type(searchInput, testData.title);
      await waitFor(()=>{
        expect(view).toHaveTextContent(testData.title);
        expect(view).not.toHaveTextContent("알림 테스트");
      })
      

      // 검색어 지우기
      await userEvent.clear(searchInput);

      await waitFor(() => {
        expect(view).toHaveTextContent(testData.title);
        expect(view).toHaveTextContent("알림 테스트");
      });

    }); 
  });


  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-01-01"));
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      await waitFor(() => {
        const firstDay = screen.getByText("1");
        const parentElement = firstDay.closest("td");
        expect(parentElement).toHaveTextContent("신정");
      });
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-05-01"));
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      await waitFor(() => {
        const fifthDay = screen.getByText("5");
        const parentElement = fifthDay.closest("td");
        expect(parentElement).toHaveTextContent("어린이날");
      });
    });

  });


  describe('일정 충돌 감지', () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다"),
      async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date("2024-07-19T09:55:00Z"));

        render(<App />);

        // 일정을 추가
        await userEvent.type(screen.getByText("제목"), "알림 테스트");
        await userEvent.type(
          screen.getByText("날짜"),
          new Date().toISOString().split("T")[0]
        );
        await userEvent.type(screen.getByText("시작 시간"), "10:00");
        await userEvent.type(screen.getByText("종료 시간"), "11:00");
        await userEvent.type(
          screen.getByText("설명"),
          "알림 테스트를 위한 새 일정"
        );
        await userEvent.type(screen.getByText("카테고리"), "개인");
        await userEvent.type(screen.getByText("위치"), "집");
        await userEvent.type(screen.getByText("알림 설정"), "4분 전");

        // 저장 버튼 클릭
        const saveButton = await screen.findByTestId("event-submit-button");
        userEvent.click(saveButton);

        //알림창이 나타나는지 확인
        await waitFor(() => {
          const alertElement = screen.getByRole("alert");
          expect(alertElement).toBeInTheDocument();
          expect(alertElement).toHaveTextContent("일정 겹침 경고");
        });
      };



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
