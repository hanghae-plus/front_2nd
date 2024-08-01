import App from "../App";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, getByLabelText, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw';

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {

    describe('일정 CRUD 및 기본 기능', () => {
      test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
        render(<App />);

        // 폼 필드 채우기
        await userEvent.type(screen.getByText('제목'), '새로운 테스트 일정');
        await userEvent.type(screen.getByText('날짜'), new Date().toISOString().split('T')[0]);
        await userEvent.type(screen.getByText('시작 시간'), '10:00');
        await userEvent.type(screen.getByText('종료 시간'), '11:00');
        await userEvent.type(screen.getByText('설명'), '통합 테스트를 위한 새 일정');
        await userEvent.type(screen.getByText('위치'), '테스트 룸');
        await userEvent.type(screen.getByText('알림 설정'), '10분 전');

        // 저장 버튼 클릭
        const saveButton = await screen.findByTestId('event-submit-button');
        fireEvent.click(saveButton);

        // 새로운 일정이 달력에 추가되었는지 확인
        await waitFor(async () => {
          const monthView = await screen.findByTestId('month-view');
          expect(monthView).toHaveTextContent('새로운 테스트 일정');
        });

        //새로운 일정이 목록에 추가되었는지 확인
        // await waitFor(async () => {
        //   const eventList = await screen.findByTestId('event-list');
        //   expect(eventList).toHaveTextContent('새로운 테스트 일정');
        // });

        // 상세 정보 확인
        // const newEventTitle = screen.getByText('새로운 테스트 일정');
        // userEvent.click(newEventTitle);

        // await waitFor(() => {
        //   expect(screen.getByText('2024-08-01')).toBeInTheDocument();
        //   expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
        //   expect(screen.getByText('통합 테스트를 위한 새 일정')).toBeInTheDocument();
        //   expect(screen.getByText('테스트 룸')).toBeInTheDocument();
        //   expect(screen.getByText('업무')).toBeInTheDocument();
        //   expect(screen.getByText('매주')).toBeInTheDocument();
        //   expect(screen.getByText('30분 전')).toBeInTheDocument();
        // });
      });
      test.fails('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다');
      test.fails('일정을 삭제하고 더 이상 조회되지 않는지 확인한다');
    });
import { describe, test } from "vitest";

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test.fails('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다');
    test.fails('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다');
    test.fails('일정을 삭제하고 더 이상 조회되지 않는지 확인한다');
  });

  describe('일정 뷰 및 필터링', () => {
    test.fails('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test.fails('주별 뷰에 일정이 정확히 표시되는지 확인한다');
    test.fails('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test.fails('월별 뷰에 일정이 정확히 표시되는지 확인한다');
  });

  describe('알림 기능', () => {
    test.fails('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다');
  });

  describe('검색 기능', () => {
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('검색어를 지우면 모든 일정이 다시 표시되어야 한다');
  });

  describe('공휴일 표시', () => {
    test.fails('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다');
    test.fails('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다');
  });

  describe('일정 충돌 감지', () => {
    test.fails('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다');
    test.fails('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다');
  });
});
