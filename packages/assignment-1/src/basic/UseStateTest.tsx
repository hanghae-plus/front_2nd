import { useState } from "react";


// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {

      //리액트의 불변성을 지키며 상태값 업데이트
    setState((state) => ({
        ...state,
        bar: {
            count: state.bar.count + 1
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
