import { render, screen, fireEvent } from '@testing-library/react';
import EventSearch from '../components/EventSearch';
import { Event } from '../types/types';

describe('EventSearch', () => {
  const mockProps = {
    searchTerm: '',
    setSearchTerm: vi.fn(),
    filteredEvents: [
      {
        id: 1,
        title: 'Test Event',
        date: '2024-08-01',
        startTime: '10:00',
        endTime: '11:00',
        description: 'Test Description',
        location: 'Test Location',
        category: 'Test Category',
        repeat: { type: 'none' },
        notificationTime: 0,
      } as Event,
    ],
    onClickEditEvent: vi.fn(),
    deleteEvent: vi.fn(),
    notifiedEvents: [1],
  };

  it('이벤트들과 검색창을 랜더링 한다.', () => {
    render(<EventSearch {...mockProps} />);

    expect(screen.getByPlaceholderText('검색어를 입력하세요')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('인풋창에 입력시 setSearchTerm을 진행한다.', () => {
    render(<EventSearch {...mockProps} />);

    const input = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(input, { target: { value: 'New Search' } });

    expect(mockProps.setSearchTerm).toHaveBeenCalledWith('New Search');
  });

  it('수정 버튼 클릭시 onClickEditEvent 함수가 실행된다.', () => {
    render(<EventSearch {...mockProps} />);

    const editButton = screen.getByLabelText('Edit event');
    fireEvent.click(editButton);

    expect(mockProps.onClickEditEvent).toHaveBeenCalledWith(mockProps.filteredEvents[0]);
  });

  it('삭제 버튼 클릭시 deleteEvent 함수가 실행된다.', () => {
    render(<EventSearch {...mockProps} />);

    const deleteButton = screen.getByLabelText('Delete event');
    fireEvent.click(deleteButton);

    expect(mockProps.deleteEvent).toHaveBeenCalledWith(1);
  });

  it('검색결과가 없다면 없다는 메시지를 노출한다.', () => {
    render(<EventSearch {...mockProps} filteredEvents={[]} />);

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });
});
