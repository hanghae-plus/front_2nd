import { useState } from "react";

// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {
    setState((prev) => {
      /**Object 복사
       * React에서는 얕은 비교를 하기 때문에 object같은 뎁스의 깊이가 있는 경우 감지를 못하기 때문에
       * object를 복사해 아예 새로운 값을 참조하여 얕은 비교가 되도록 유도하여 재랜더링 trigger
       */
      const newValue = {
        ...prev,
      };

      newValue.bar.count = prev.bar.count + 1;

      return newValue;
    });
  };

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
