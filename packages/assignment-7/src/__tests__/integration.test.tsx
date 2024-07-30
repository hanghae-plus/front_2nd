import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import App from '../App';
import { mockServer } from '../lib/services/mockWorker';

describe('일정 관리 애플리케이션 통합 테스트', () => {
  beforeAll(() => {
    mockServer.listen();
  });
  afterEach(() => {
    mockServer.resetHandlers();
  });
  afterAll(() => {
    mockServer.close();
  });
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-07-31');
      await userEvent.type(screen.getByLabelText(/시작 시간/), '13:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '15:00');
      await userEvent.type(screen.getByLabelText(/설명/), 'Test 설명');
      await userEvent.type(screen.getByLabelText(/위치/), 'Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '업무');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        expect(eventList).toHaveTextContent('Test 일정');
        expect(eventList).toHaveTextContent('2024-07-31');
        expect(eventList).toHaveTextContent('13:00 - 15:00');
        expect(eventList).toHaveTextContent('Test 설명');
        expect(eventList).toHaveTextContent('Test 위치');
        expect(eventList).toHaveTextContent('업무');
      });
    });
    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);

      const editButtons = await screen.findAllByLabelText('Edit event');
      await userEvent.click(editButtons[0]);

      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), '수정된 Test 일정');
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-07-05');
      await userEvent.clear(screen.getByLabelText(/시작 시간/));
      await userEvent.type(screen.getByLabelText(/시작 시간/), '14:00');
      await userEvent.clear(screen.getByLabelText(/종료 시간/));
      await userEvent.type(screen.getByLabelText(/종료 시간/), '16:00');
      await userEvent.clear(screen.getByLabelText(/설명/));
      await userEvent.type(screen.getByLabelText(/설명/), '수정된 Test 설명');
      await userEvent.clear(screen.getByLabelText(/위치/));
      await userEvent.type(screen.getByLabelText(/위치/), '수정된 Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '개인');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        expect(eventList).toHaveTextContent('수정된 Test 일정');
        expect(eventList).toHaveTextContent('2024-07-05');
        expect(eventList).toHaveTextContent('14:00 - 16:00');
        expect(eventList).toHaveTextContent('수정된 Test 설명');
        expect(eventList).toHaveTextContent('수정된 Test 위치');
        expect(eventList).toHaveTextContent('개인');
      });
    });
    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다');
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test('주별 뷰에 일정이 정확히 표시되는지 확인한다');
    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test('월별 뷰에 일정이 정확히 표시되는지 확인한다');
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다');
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다');
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다');
    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다');
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다');
    test(
      '기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다'
    );
  });
});
