import { useState } from "react";

// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {
    // 객체 내부의 값을 increase 시키기 때문에, 상태 객체를 복사 후 변경점을 적용
    const updatedState = {
      ...state,
      bar: { count: state.bar.count + 1 },
    };
    setState(updatedState);
  };

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
