import { describe, test, expect } from "vitest";
import { renderHook, act } from '@testing-library/react-hooks';
import { useEventManagement } from '../hooks/useEventManagement';

describe('useEventManagement 훅', () => {
  test('새 이벤트 추가 시 이벤트 목록이 업데이트된다', () => {
    const { result } = renderHook(() => useEventManagement());
    
    act(() => {
      result.current.addEvent({ id: 1, name: 'New Event' });
    });
    
    expect(result.current.events).toEqual([{ id: 1, name: 'New Event' }]);
  });

  test('이벤트 삭제 시 해당 이벤트가 목록에서 제거된다', () => {
    const { result } = renderHook(() => useEventManagement());
    
    act(() => {
      result.current.addEvent({ id: 1, name: 'Event to Remove' });
    });

    act(() => {
      result.current.removeEvent(1);
    });
    
    expect(result.current.events).toEqual([]);
  });
});
