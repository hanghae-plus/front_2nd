import { useState } from "react";


// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseStateTest() {
  const [state, setState] = useState({ bar: { count: 1 } });

  // 기존 코드 => 상태객체를 직접 수정 : 객체의 참조가 바뀌지 않으므로 리렌더링 되지 않음
  // 수정 코드 => 이전 상태를 복사-변경하여 새로운 객체 생성 : 객체의 참조가 바뀌어서 리랜더링
  const increment = () => {
    setState((prev)=>  {return {...prev, bar : {count : prev.bar.count + 1}}})
  }

  return (
    <div>
      count: {state.bar.count}
      <button onClick={increment}>증가</button>
    </div>
  );
}
