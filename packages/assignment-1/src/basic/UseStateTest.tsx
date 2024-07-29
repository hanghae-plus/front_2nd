import { useState } from "react";


// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {
    setState(prevState => ({
      ...prevState, // 기존 상태 복사
      bar: {
        ...prevState.bar, // bar 객체를 복사
        count: prevState.bar.count + 1
      }
    }));
  }

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
