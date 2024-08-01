import { render, screen, waitFor } from '@testing-library/react';
import WeekView from '../components/calendar/WeekView';
import { date, startTime, endTime } from '../utils/testUtils';
import { Event } from '../types/types';
import { WEEK_DAYS } from '../constants/constants';

describe('WeekView', () => {
  const mockProps = {
    currentDate: new Date(2024, 7, 15),
    events: [
      {
        id: 1,
        title: 'Test Event',
        date: '2024-08-15',
        startTime: startTime,
        endTime: endTime,
      },
    ] as Event[],
    notifiedEvents: [1],
    holidays: { '2024-08-15': '광복절' },
  };

  it('랜더링이 정확히 된다.', () => {
    render(<WeekView {...mockProps} />);
    expect(screen.getByTestId('week-view')).toBeInTheDocument();
    expect(screen.getByText('2024년 8월 2주')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('광복절')).toBeInTheDocument();
  });

  it('해당 주의 모든 일수를 반환 한다.', () => {
    render(<WeekView {...mockProps} />);
    expect(screen.getByTestId('week-view')).toBeInTheDocument();

    WEEK_DAYS.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
    const daysOfThatWeek = [12, 13, 14, 15, 16, 17, 18];
    daysOfThatWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('알림이 설정된 이벤트가 하이라이트가 되어 있다.', () => {
    render(<WeekView {...mockProps} />);

    const notifiedEvent = screen.getByText('Test Event');

    expect(notifiedEvent.closest('div')).toHaveClass('chakra-stack css-79m8xe');
  });
});
