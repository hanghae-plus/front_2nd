import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventCard from '../EventCard';
import { Event } from '../../types';

describe('EventCard Component', () => {
  const mockEvent: Event = {
    id: 1,
    title: '팀 미팅',
    description: '주간 팀 미팅 및 프로젝트 진행 상황 논의',
    date: '2024-05-15',
    startTime: '10:00',
    endTime: '11:30',
    category: '업무',
    location: '회의실 A',
    repeat: {
      type: 'weekly',
      interval: 1,
      endDate: '2024-06-30',
    },
    notificationTime: 15, // 15분 전 알림
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('일정 상세 항목이 제대로 렌더링 된다.', () => {
    render(
      <EventCard
        event={mockEvent}
        isNotified={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText('팀 미팅')).toBeInTheDocument();
    expect(screen.getByText(/2024.*05.*15/)).toBeInTheDocument();
    expect(screen.getByText(/10:00.*11:30/)).toBeInTheDocument();
    expect(
      screen.getByText('주간 팀 미팅 및 프로젝트 진행 상황 논의')
    ).toBeInTheDocument();
    expect(screen.getByText('회의실 A')).toBeInTheDocument();
    expect(screen.getByText('카테고리: 업무')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시, onEdit 함수를 호출한다.', () => {
    render(
      <EventCard
        event={mockEvent}
        isNotified={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit event'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });

  it('삭제 버튼 클릭 시, onDelete 함수를 호출한다. ', () => {
    render(
      <EventCard
        event={mockEvent}
        isNotified={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete event'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockEvent.id);
  });

  it('알림 중인 일정에는 알림 아이콘이 표시된다.', () => {
    render(
      <EventCard
        event={mockEvent}
        isNotified={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('notification-icon')).toBeInTheDocument();
  });
});
