import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import { mockEvents, resetMockEvents } from "../mockApiHandlers";

const mockToastFn = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => mockToastFn,
  };
});

describe("일정 관리 애플리케이션 통합 테스트", () => {
  afterEach(() => {
    resetMockEvents();
    vi.useRealTimers();
  });

  describe("일정 CRUD 및 기본 기능", () => {
    beforeEach(() => {
      vi.setSystemTime(new Date("2024-07-25"));
      render(<App />);
    });
    describe("일정 관리 유효성 검사", () => {
      describe("필수 정보 (제목, 날짜, 시작 시간, 종료 시간) 유효성 검사", () => {
        it("필수 정보 누락 시 일정 생성 버튼을 클릭하면 정보를 모두 입력해달라는 토스트 메세지가 노출되어야 한다.", async () => {
          await userEvent.click(
            screen.getByRole("button", { name: /일정 추가/i })
          );

          await waitFor(() => {
            expect(mockToastFn).toHaveBeenCalledWith({
              title: "필수 정보를 모두 입력해주세요.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        });

        it("필수 정보를 올바르게 입력하면 토스트 메세지가 노출되지 않아야 한다.", async () => {
          await userEvent.type(screen.getByLabelText(/제목/i), "테스트 일정");
          await userEvent.type(screen.getByLabelText(/날짜/i), "2022-12-25");
          await userEvent.type(screen.getByLabelText(/시작 시간/i), "09:00");
          await userEvent.type(screen.getByLabelText(/종료 시간/i), "10:00");

          await userEvent.click(
            screen.getByRole("button", { name: /일정 추가/i })
          );

          await waitFor(() => {
            expect(mockToastFn).not.toHaveBeenCalledWith({
              title: "필수 정보를 모두 입력해주세요.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        });
      });

      describe("시작시간, 종료시간 유효성 검사", () => {
        it("종료시간이 시작시간보다 빠르면 시간 설정을 확인해달라는 토스트 메세지가 노출되어야 한다.", async () => {
          await userEvent.type(screen.getByLabelText(/제목/i), "테스트 일정");
          await userEvent.type(screen.getByLabelText(/날짜/i), "2022-12-25");
          await userEvent.type(screen.getByLabelText(/시작 시간/i), "10:00");
          await userEvent.type(screen.getByLabelText(/종료 시간/i), "09:00");

          await userEvent.click(
            screen.getByRole("button", { name: /일정 추가/i })
          );

          await waitFor(() => {
            expect(mockToastFn).toHaveBeenCalledWith({
              title: "시간 설정을 확인해주세요.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        });

        it("시작시간, 종료시간이 올바르게 입력되면 토스트 메세지가 노출되지 않아야 한다.", async () => {
          await userEvent.type(screen.getByLabelText(/시작 시간/i), "09:00");
          await userEvent.type(screen.getByLabelText(/종료 시간/i), "10:00");

          await userEvent.click(
            screen.getByRole("button", { name: /일정 추가/i })
          );

          await waitFor(() => {
            expect(mockToastFn).not.toHaveBeenCalledWith({
              title: "시간 설정을 확인해주세요.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        });
      });
    });

    describe("일정 생성", () => {
      it("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
        await userEvent.type(screen.getByLabelText(/제목/i), "테스트 일정");
        await userEvent.type(screen.getByLabelText(/날짜/i), "2022-12-28");
        await userEvent.type(screen.getByLabelText(/시작 시간/i), "09:00");
        await userEvent.type(screen.getByLabelText(/종료 시간/i), "10:00");

        await userEvent.type(screen.getByLabelText(/설명/i), "테스트 설명");
        await userEvent.type(screen.getByLabelText(/위치/i), "테스트 위치");
        await userEvent.selectOptions(
          screen.getByLabelText(/카테고리/i),
          "개인"
        );
        await userEvent.click(screen.getByLabelText(/반복 설정/i));
        await userEvent.type(screen.getByLabelText(/알림 설정/i), "10");

        await userEvent.click(
          screen.getByRole("button", { name: /일정 추가/i })
        );

        await waitFor(() => {
          expect(mockToastFn).toHaveBeenCalledWith({
            title: "일정이 추가되었습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      });

      it("새로운 일정 생성에 실패하면 저장이 실패했다는 에러 토스트 메세지가 노출되어야 한다. ", async () => {
        await userEvent.type(screen.getByLabelText(/제목/i), "테스트 에러");
        await userEvent.type(screen.getByLabelText(/날짜/i), "2022-12-26");
        await userEvent.type(screen.getByLabelText(/시작 시간/i), "09:00");
        await userEvent.type(screen.getByLabelText(/종료 시간/i), "10:00");

        await userEvent.click(
          screen.getByRole("button", { name: /일정 추가/i })
        );

        await waitFor(() => {
          expect(mockToastFn).toHaveBeenCalled();
        });
      });
    });

    describe("일정 수정", () => {
      beforeEach(async () => {
        const element = await screen.findAllByTestId("edit-event-button");
        await userEvent.click(element[0]);
      });

      it("제목 타이틀이 일정 수정으로 변경되어야 한다.", async () => {
        expect(
          await screen.findByRole("heading", { name: /일정 수정/i })
        ).toBeInTheDocument();
      });

      it("수정할 일정 정보가 폼에 입력되어 있어야 한다.", async () => {
        expect(
          await screen.findByDisplayValue(mockEvents[0].title)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].date)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].startTime)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].endTime)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].description)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].location)
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue(mockEvents[0].category)
        ).toBeInTheDocument();
      });

      it("일정 수정 후 저장 버튼을 클릭하면 수정이 완료되었다는 토스트 메세지가 노출되어야 한다.", async () => {
        const button = await screen.findByRole("button", {
          name: /일정 수정/i,
        });
        await userEvent.click(button);

        await waitFor(() => {
          expect(mockToastFn).toHaveBeenCalledWith({
            title: "일정이 수정되었습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      });

      it("일정 수정에 실패하면 수정이 실패했다는 에러 토스트 메세지가 노출되어야 한다.", async () => {
        await userEvent.clear(screen.getByLabelText(/제목/i));
        await userEvent.type(screen.getByLabelText(/제목/i), "테스트 에러");

        const button = await screen.findByRole("button", {
          name: /일정 수정/i,
        });
        await userEvent.click(button);

        await waitFor(() => {
          expect(mockToastFn).toHaveBeenCalledWith({
            title: "일정 수정 실패",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
      });
    });

    describe("일정 삭제", () => {
      it("일정이 삭제되었다는 토스트 메세지가 노출되어야 한다.", async () => {
        const deleteButton = await screen.findAllByTestId(
          "delete-event-button"
        );
        await userEvent.click(deleteButton[0]);

        await waitFor(() => {
          expect(mockToastFn).toHaveBeenCalledWith({
            title: "일정이 삭제되었습니다.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        });
      });
    });
  });

  describe("캘린더 일정 조회 및 필터링 기능", () => {
    beforeEach(() => {
      vi.setSystemTime(new Date("2024-07-25"));
      render(<App />);
    });
    it("주별 뷰이면 일주일 일정만 노출되어야 한다.", async () => {
      expect(screen.getAllByRole("row")).not.toHaveLength(2);

      await userEvent.selectOptions(
        screen.getByTestId("calendar-view-select"),
        "week"
      );

      expect(await screen.findAllByRole("row")).toHaveLength(2);
    });

    it("월별 뷰이면 한달 일정이 노출되어야 한다.", async () => {
      await userEvent.selectOptions(
        screen.getByTestId("calendar-view-select"),
        "month"
      );

      expect((await screen.findAllByRole("row")).length > 2).toBeTruthy();
    });

    it("일정이 있는 날이면 달력에 표시되어야 한다.", async () => {
      const event = await screen.findByTestId(mockEvents[0].date);
      const eventBadge = (
        await within(event).findAllByTestId("event-badge")
      )[0];

      expect(eventBadge).toBeInTheDocument();
    });
  });

  describe("알림 기능", () => {
    it("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      render(<App />);

      expect(await screen.findByRole("alert")).toBeInTheDocument();
    });
  });

  describe("검색 기능", () => {
    beforeEach(() => {
      vi.setSystemTime(new Date("2024-07-25"));
      render(<App />);
    });
    it("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      expect(
        await screen.findByTestId(mockEvents[0].title)
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId(mockEvents[1].title)
      ).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText(/검색어를 입력하세요/i);
      await userEvent.type(searchInput, mockEvents[0].title);

      expect(
        await screen.findByTestId(mockEvents[0].title)
      ).toBeInTheDocument();
      expect(screen.queryByTestId(mockEvents[1].title)).not.toBeInTheDocument();
    });

    it("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      expect(
        await screen.findByTestId(mockEvents[0].title)
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId(mockEvents[1].title)
      ).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText(/검색어를 입력하세요/i);
      await userEvent.type(searchInput, mockEvents[0].title);

      await userEvent.clear(searchInput);

      expect(
        await screen.findByTestId(mockEvents[0].title)
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId(mockEvents[1].title)
      ).toBeInTheDocument();
    });
  });

  describe("공휴일 표시", () => {
    it("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-01-01"));
      render(<App />);

      expect(await screen.findByTestId("신정")).toBeInTheDocument();
    });
    it("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-05-05"));
      render(<App />);

      expect(await screen.findByTestId("어린이날")).toBeInTheDocument();
    });
  });

  describe("일정 충돌 감지", () => {
    beforeEach(() => {
      vi.setSystemTime(new Date("2024-07-25"));
      render(<App />);
    });
    it("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      await userEvent.type(screen.getByLabelText(/제목/i), mockEvents[0].title);
      await userEvent.type(screen.getByLabelText(/날짜/i), mockEvents[0].date);
      await userEvent.type(
        screen.getByLabelText(/시작 시간/i),
        mockEvents[0].startTime
      );
      await userEvent.type(
        screen.getByLabelText(/종료 시간/i),
        mockEvents[0].endTime
      );

      await userEvent.click(screen.getByRole("button", { name: /일정 추가/i }));

      expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();
    });

    it("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      const element = await screen.findAllByTestId("edit-event-button");
      await userEvent.click(element[1]);

      await userEvent.clear(screen.getByLabelText(/제목/i));
      await userEvent.clear(screen.getByLabelText(/날짜/i));
      await userEvent.clear(screen.getByLabelText(/시작 시간/i));
      await userEvent.clear(screen.getByLabelText(/종료 시간/i));

      await userEvent.type(screen.getByLabelText(/제목/i), mockEvents[0].title);
      await userEvent.type(screen.getByLabelText(/날짜/i), mockEvents[0].date);
      await userEvent.type(
        screen.getByLabelText(/시작 시간/i),
        mockEvents[0].startTime
      );
      await userEvent.type(
        screen.getByLabelText(/종료 시간/i),
        mockEvents[0].endTime
      );

      const button = await screen.findByRole("button", {
        name: /일정 수정/i,
      });
      await userEvent.click(button);

      expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();
    });
  });
});
