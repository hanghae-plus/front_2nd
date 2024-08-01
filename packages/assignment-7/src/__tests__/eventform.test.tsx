import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '../components/EventForm';
import { EventFormState } from '../hooks/useEventForm';

describe('EventForm', () => {
  const mockProps = {
    isEditingEvent: false,
    handleAddOrUpdateEvent: vi.fn(),
    formData: {
      id: null,
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1, endDate: '' },
      notificationTime: 0,
      isRepeating: false,
      errors: {},
    } as EventFormState,
    setField: vi.fn(),
    validateTime: vi.fn(),
  };

  it('정확하게 렌더링이 된다.', () => {
    render(<EventForm {...mockProps} />);

    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('날짜')).toBeInTheDocument();
    expect(screen.getByLabelText('시작 시간')).toBeInTheDocument();
    expect(screen.getByLabelText('종료 시간')).toBeInTheDocument();
  });

  it('인풋이 변화할때 setField를 실행한다.', () => {
    render(<EventForm {...mockProps} />);

    const titleInput = screen.getByLabelText('제목');
    fireEvent.change(titleInput, { target: { value: 'New Event' } });

    expect(mockProps.setField).toHaveBeenCalledWith('title', 'New Event');
  });

  it('일정 추가 버튼 클릭시 handleAddOrUpdateEvent가 호출된다.', () => {
    render(<EventForm {...mockProps} />);

    const submitButton = screen.getByTestId('event-submit-button');
    fireEvent.click(submitButton);

    expect(mockProps.handleAddOrUpdateEvent).toHaveBeenCalled();
  });

  it('수정 모드일 때는 텍스트들이 일정 수정으로 변경된다', () => {
    render(<EventForm {...mockProps} isEditingEvent={true} />);

    const submitButton = screen.getByTestId('event-submit-button');
    expect(submitButton).toHaveTextContent('일정 수정');
  });

  it('추가 모드일 때는 텍스트들이 일정 추가로 표시된다', () => {
    render(<EventForm {...mockProps} isEditingEvent={false} />);

    const submitButton = screen.getByTestId('event-submit-button');
    expect(submitButton).toHaveTextContent('일정 추가');
  });

  it('반복 일정 설정시 하위 셀렉트 박스가 노출된다.', () => {
    const propsWithRepeat = {
      ...mockProps,
      formData: { ...mockProps.formData, isRepeating: true },
    };
    render(<EventForm {...propsWithRepeat} />);

    expect(screen.getByText('반복 유형')).toBeInTheDocument();
  });
});
