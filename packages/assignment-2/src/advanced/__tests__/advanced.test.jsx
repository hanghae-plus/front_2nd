import { describe, expect, it, vi } from "vitest";
import { memo1, memo2, TestContextProvider, useCounter, useCustomState, useTodoItems, useUser } from "../advanced";
import { act, fireEvent, render } from "@testing-library/react";

let a;
let b;

describe('assignment 2 > advanced', () => {
  describe('값을 캐시하기 > ', () => {
    it.each([
      { fn: () => Array.from({ length: a }).map((_, k) => k + 1) },
      { fn: () => Array.from({ length: a }).map((_, k) => k * 10) },
    ])('memo1 $fn > ', ({ fn }) => {
      a = 1000000;
      expect(fn() === fn()).toBe(false);
      expect(memo1(fn) === memo1(fn)).toBe(true);
      a = 1;
      expect(fn().length).toBe(1);
      expect(memo1(fn).length).toBe(1000000);
    })

    it.each([
      { fn: () => Array.from({ length: a * b }).map((_, k) => k + 1) },
      { fn: () => Array.from({ length: a * b }).map((_, k) => k * 10) }
    ])('memo2 $fn > ', ({ fn }) => {
      a = 100;
      b = 100;
      expect(fn() === fn()).toBe(false);
      expect(memo2(fn, [a]) === memo2(fn, [a])).toBe(true);
      a = 1;
      expect(fn().length).toBe(100);
      expect(memo2(fn, [a]).length).toBe(100);
      b = 1;
      expect(fn().length).toBe(1);
      expect(memo2(fn, [a]).length).toBe(100);
    })
  })

  describe('실제로 값이 달라졌을 때 렌더링하기', () => {
    it('object > ', async () => {
      let changedValue = 1;
      const mockFn = vi.fn();

      const Component = ({ countRendering }) => {
        const [{ value }, setState] = useCustomState({ value: 1 });
        countRendering();

        return <div data-testid="el" onClick={() => setState({ value: changedValue })}>{value}</div>
      }

      const { findByTestId } = render(<Component countRendering={mockFn}/>);

      expect(mockFn).toBeCalledTimes(1);

      const target = await findByTestId('el');

      act(() => {
        fireEvent.click(target)
      })

      expect(mockFn).toBeCalledTimes(1);

      act(() => {
        changedValue = 2;
        fireEvent.click(target)
      })

      expect(mockFn).toBeCalledTimes(2);
    })

    it('array > ', async () => {

      const items = [];

      const mockFn = vi.fn();

      const Component = ({ countRendering }) => {
        countRendering();
        const [state, setState] = useCustomState([]);

        return (
          <div data-testid="el" onClick={() => setState([...items])}>
            <ul>
              {state.map(item => (
                <li key={item.id}>
                  {item.content} / {item.completed && '✅'}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      const { findByTestId } = render(<Component countRendering={mockFn}/>);

      expect(mockFn).toBeCalledTimes(1);

      const target = await findByTestId('el');

      act(() => {
        fireEvent.click(target)
      })

      expect(mockFn).toBeCalledTimes(1);

      act(() => {
        items.push(...[
          { id: 1, content: 'PT 받기', completed: false },
          { id: 2, content: '회사일', completed: false },
          { id: 3, content: '멘토링', completed: false },
          { id: 4, content: '과제 만들기', completed: false },
          { id: 5, content: '발제자료 만들기', completed: false },
          { id: 6, content: '고양이 밥주기', completed: false },
        ]);
        fireEvent.click(target)
      })

      expect(mockFn).toBeCalledTimes(2);

      act(() => {
        fireEvent.click(target)
      })

      expect(mockFn).toBeCalledTimes(2);
    })
  })

  it('전역 상태를 참조할 때, 불필요한 렌더링 방지하기', async () => {
    const state = {
      user: null,
      todoItems: [
        { id: 1, content: 'PT 받기', completed: false },
        { id: 2, content: '회사일', completed: false },
        { id: 3, content: '멘토링', completed: false },
        { id: 4, content: '과제 만들기', completed: false },
        { id: 5, content: '발제자료 만들기', completed: false },
        { id: 6, content: '고양이 밥주기', completed: false },
      ],
    }

    const countUserRendering = vi.fn();
    const countCounterRendering = vi.fn();
    const countTodoRendering = vi.fn();

    const User = () => {
      countUserRendering();
      const [user, setUser] = useUser();
      return (
        <section>
          <ul>
            <li>{user?.name}</li>
            <li>{user?.id}</li>
          </ul>
          <button data-testid="user" onClick={() => setUser({ name: '테스터', id: 'tester' })}>유저 변경</button>
        </section>
      )
    }

    const Counter = () => {
      countCounterRendering();
      const [count, setCount] = useCounter();
      return (
        <section>
          <p>{count}</p>
          <button data-testid="counter" onClick={() => setCount(count + 1)}>증가</button>
        </section>
      )
    }

    const TodoItems = () => {
      countTodoRendering();
      const [todoItems, setTodoItems] = useTodoItems();
      return (
        <section>
          <ul>
            {todoItems.map(item => (
              <li key={item.id}>
                {item.content} / {item.completed && '✅'}
              </li>
            ))}
          </ul>
          <button data-testid="todo" onClick={() => setTodoItems([...todoItems, state.todoItems.shift()])}>아이템 추가
          </button>
        </section>
      )
    }

    const TestComponent = () => {
      return (
        <TestContextProvider>
          <User/>
          <Counter/>
          <TodoItems/>
        </TestContextProvider>
      )
    }

    const { findByTestId } = render(<TestComponent/>);

    const [$userButton, $counterButton, $todoButton] = await Promise.all([
      findByTestId('user'),
      findByTestId('counter'),
      findByTestId('todo'),
    ])

    expect(countUserRendering).toBeCalledTimes(1);
    expect(countCounterRendering).toBeCalledTimes(1);
    expect(countTodoRendering).toBeCalledTimes(1);

    act(() => {
      fireEvent.click($userButton);
    })

    expect(countUserRendering).toBeCalledTimes(2);
    expect(countCounterRendering).toBeCalledTimes(1);
    expect(countTodoRendering).toBeCalledTimes(1);

    act(() => {
      fireEvent.click($counterButton);
    })

    expect(countUserRendering).toBeCalledTimes(2);
    expect(countCounterRendering).toBeCalledTimes(2);
    expect(countTodoRendering).toBeCalledTimes(1);

    act(() => {
      fireEvent.click($counterButton);
    })

    expect(countUserRendering).toBeCalledTimes(2);
    expect(countCounterRendering).toBeCalledTimes(3);
    expect(countTodoRendering).toBeCalledTimes(1);

    act(() => {
      fireEvent.click($todoButton);
    })

    expect(countUserRendering).toBeCalledTimes(2);
    expect(countCounterRendering).toBeCalledTimes(3);
    expect(countTodoRendering).toBeCalledTimes(2);

    act(() => {
      fireEvent.click($todoButton);
    })

    expect(countUserRendering).toBeCalledTimes(2);
    expect(countCounterRendering).toBeCalledTimes(3);
    expect(countTodoRendering).toBeCalledTimes(3);

  })
})
