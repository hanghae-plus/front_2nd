import { prettyDOM, render, screen, waitFor } from '@testing-library/react';
import MonthView from '../components/calendar/MonthView';
import { Event } from '../types/types';
import { date, startTime, endTime } from '../utils/testUtils';

describe('MonthView', () => {
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

  it('제대로 랜더링이 된다.', () => {
    render(<MonthView {...mockProps} />);
    expect(screen.getByTestId('month-view')).toBeInTheDocument();

    expect(screen.getByText('2024년 8월')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('광복절')).toBeInTheDocument();
  });

  it('8월의 총 일수는 31일이다.', () => {
    render(<MonthView {...mockProps} />);

    const days = screen.getAllByRole('cell').filter((cell) => cell.textContent !== '');
    expect(days.length).toBe(31); // August has 31 days
  });

  it('알림이 설정된 이벤트가 하이라이트가 되어 있다', () => {
    render(<MonthView {...mockProps} />);

    const notifiedEvent = screen.getByText('Test Event');

    expect(notifiedEvent.closest('div')).toHaveClass('chakra-stack css-79m8xe');
  });
});
