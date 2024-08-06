import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationList } from '../components/NotificationList';

describe('NotificationList', () => {
  const mockNotifications = [
    { id: 1, message: 'Test Notification 1' },
    { id: 2, message: 'Test Notification 2' },
  ];

  const mockRemoveNotification = vi.fn();

  it('랜더링이 정확하게 된다.', () => {
    render(<NotificationList notifications={mockNotifications} removeNotification={mockRemoveNotification} />);

    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
  });

  it('닫기 버튼을 눌렀을 때 removeNotification이 호출 된다.', () => {
    render(<NotificationList notifications={mockNotifications} removeNotification={mockRemoveNotification} />);

    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);

    expect(mockRemoveNotification).toHaveBeenCalledWith(1);
  });

  it('리스트에 아무런 알림도 없을때는 해당 컴포넌트에 랜더링이 일어나지 않는다.', () => {
    render(<NotificationList notifications={[]} removeNotification={mockRemoveNotification} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
