import { useState } from "react";

// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState(1);

  const increment = () => {
    setState(state + 1);
  };

  return (
    <div>
      count: {state}
      <button onClick={increment}>증가</button>
    </div>
  );
}
