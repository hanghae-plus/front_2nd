import { useState } from "react";


// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  const increment = () => {
    state.bar.count += 1;
    setState({...state}); //다음 state가 이전 state와 같으면 업데이트를 무시하므로 새로운 객체를 생성해야함(spread 연산자 사용)
  }

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
