import { useState } from "react";

// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {
    // 상태값을 직접 변경하면 안 된다.
    const newValue = state.bar.count + 1;
    const newBar = { bar: { count: newValue } };
    setState(newBar);
  };

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
