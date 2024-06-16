import { useState } from "react";

// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  // const increment = () => {
  //   state.bar.count += 1;
  //   setState(state);
  // }

  const increment = () => {
    setState((prev) => {
      /**Object 복사 */
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
