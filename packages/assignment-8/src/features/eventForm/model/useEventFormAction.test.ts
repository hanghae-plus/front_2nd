import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, beforeEach, vi, expect } from 'vitest';
import { useEventFormActions } from './useEventFormActions';

describe('useEventFormAction hook 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setInterval', 'Date'],
    });
    vi.setSystemTime(new Date(2024, 6, 1));
  });

  test('date가 오늘 날짜인가', () => {
    const { result } = renderHook(() => useEventFormActions());

    const nowDate = new Date().toISOString().slice(0, 10);
    expect(nowDate).toEqual(result.current?.state.date);
  });

  test('state 업데이트가 잘 되는가', async () => {
    const { result } = renderHook(() => useEventFormActions());

    act(() => {
      result.current?.updateField('title', '새 이벤트');
      result.current?.updateField('date', '2023-05-01');
    });

    await waitFor(() => {
      expect(result.current?.state).toMatchObject({
        title: '새 이벤트',
        date: '2023-05-01',
      });
    });
  });
});
