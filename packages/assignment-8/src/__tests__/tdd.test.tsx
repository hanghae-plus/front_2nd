import userEvent from '@testing-library/user-event';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import App from '../App';

const setup = () => {
  const user = userEvent.setup();
  return {
    user,
    ...render(<App />),
  };
};

describe('반복 일정', () => {
  describe('반복 선택', () => {
    test('일정 생성 > 반복 일정 선택시 반복 유형이 나타난다.', async () => {
      const { user } = setup();
      // '반복 일정' 체크박스 클릭
      await user.click(screen.getByLabelText('반복 일정'));
      // '반복 유형' 선택 옵션이 나타나는지 확인
      expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    });

    test('일정 생성 > 반복 유형이 반복 안함이 아니라면 반복 간격과 반복 종료일을 설정하는 부분이 나타난다.', async () => {
      const { user } = setup();
      // '반복 일정' 체크박스 클릭
      await user.click(screen.getByLabelText('반복 일정'));
      // '반복 유형'을 '매일'로 선택
      await user.selectOptions(screen.getByLabelText('반복 유형'), 'daily');
      // '반복 간격'과 '반복 종료일' 입력 필드가 나타나는지 확인
      expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
      expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
    });

    test('일정 날짜보다 반복 종료일이 더 빠르면 에러 메세지가 노출된다.', async () => {
      const { user } = setup();

      // 일정 날짜 설정
      await user.type(screen.getByLabelText('날짜'), '2024-08-05');

      // '반복 일정' 체크박스 클릭
      await user.click(screen.getByLabelText('반복 일정'));

      // '반복 유형'을 '매일'로 선택
      await user.selectOptions(screen.getByLabelText('반복 유형'), 'daily');

      // 반복 종료일을 일정 날짜보다 이전으로 설정
      await user.type(screen.getByLabelText('반복 종료일'), '2024-08-04');

      // 에러 메시지가 나타나는지 확인
      await waitFor(() => {
        expect(screen.getByText('종료일은 시작일보다 늦어야 합니다.')).toBeInTheDocument();
      });
    });
  });

  describe('반복 일정 생성', async () => {
    const { user } = setup();

    // 일정 생성 로직 (일정 추가 버튼 클릭, 필드 입력 등)
    await user.type(screen.getByLabelText('제목'), '반복 일정 테스트');
    await user.type(screen.getByLabelText('날짜'), '2024-08-05');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.click(screen.getByLabelText('반복 일정'));
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'daily');
    await user.type(screen.getByLabelText('반복 종료일'), '2024-08-10');

    // 일정 추가 버튼 클릭
    await user.click(screen.getByTestId('event-submit-button'));

    test('반복 일정 생성시 n개의 일정이 추가되었습니다. 라는 토스트 메세지가 화면에 노출된다.', async () => {
      // 토스트 메시지 확인
      await waitFor(() => {
        expect(screen.getByText('6개의 일정이 추가되었습니다.')).toBeInTheDocument();
      });
    });

    test('반복에 맞는 이벤트 리스트를 반환한다.', async () => {});

    test('매일 반복시 연이은 날짜에 같은 제목,시간의 데이터가 추가로 반환된다.', () => {});

    test('매주 반복시 생성 데이터로부터 일주일 후에 같은 제목, 시간의 데이터가 추가로 반환된다.', () => {});

    test('매달 반복시 생성 데이터로부터 한달 후에 같은 제목,시간의 데이터가 추가로 반환된다.', () => {});

    test('매년 반복시 생성 데이터로부터 1년 후에 같은 제목,시간의 데이터가 추가로 반환된다.', () => {});
  });

  describe('반복 일정 표시', async () => {
    const { user } = setup();

    // 일정 생성 로직 (일정 추가 버튼 클릭, 필드 입력 등)
    await user.type(screen.getByLabelText('제목'), '반복 일정 테스트');
    await user.type(screen.getByLabelText('날짜'), '2024-08-05');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.click(screen.getByLabelText('반복 일정'));
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'daily');
    await user.type(screen.getByLabelText('반복 종료일'), '2024-08-10');

    // 일정 추가 버튼 클릭
    await user.click(screen.getByTestId('event-submit-button'));

    test('캘린더 뷰> 반복 일정의 경우 css가 적용된다.', async () => {
      // 반복 일정에 특정 CSS 클래스가 적용되었는지 확인
      const repeatedEvents = await screen.getAllByTestId('repeated-event');
      // 반복 일정의 배경색 확인
      repeatedEvents.forEach((event) => {
        const style = window.getComputedStyle(event);
        expect(style.backgroundColor).not.toBe(''); // 배경색이 설정되어 있는지 확인
        expect(style.backgroundColor).not.toBe('rgb(254, 226, 226)'); // red.100이 아님
        expect(style.backgroundColor).not.toBe('rgb(243, 244, 246)'); // gray.100이 아님
      });
    });

    test('캘린더 뷰> 반복 일정의 경우 repeatId가 같으면 같은 색상의 bg를 가진다.', async () => {
      // 반복 일정들의 배경색이 같은지 확인
      const repeatedEvents = screen.getAllByTestId('repeated-event');
      // repeatId와 배경색을 저장할 객체
      const colorMap = new Map();

      // 각 반복 일정의 repeatId와 배경색 확인
      for (const event of repeatedEvents) {
        const repeatId = event.getAttribute('data-repeat-id');
        const backgroundColor = window.getComputedStyle(event).backgroundColor;

        if (repeatId) {
          if (colorMap.has(repeatId)) {
            // 이미 저장된 색상과 비교
            expect(backgroundColor).toBe(colorMap.get(repeatId));
          } else {
            // 새로운 repeatId의 색상 저장
            colorMap.set(repeatId, backgroundColor);
          }
        }
      }

      // 최소한 하나의 반복 일정이 있는지 확인
      expect(colorMap.size).toBeGreaterThan(0);
    });

    test('검색 리스트 뷰> 반복일정의 경우 테스트 아이디가 repeat-color-chip 인 컬러칩이 노출된다.', async () => {
      // 반복 일정에 컬러칩이 노출되는지 확인
      const colorChips = screen.getAllByTestId('repeat-color-chip');
      expect(colorChips.length).toBeGreaterThan(0);
    });
  });
});
