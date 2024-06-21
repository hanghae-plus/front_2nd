import { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  // useCallback을 사용하여 함수가 리렌더링에 의해 재생성되지 않도록 변경
  // => 자식 컴포넌트(MeowButton 및 BarkButton)가 불필요하게 리렌더링 되지 않도록 함

  // 의존성배열의 값이 변경될 때만 함수가 재생성 됨
  // 변경 X => 이전에 생성된 함수를 사용
  // 변경 O => 변경되면 새로운 함수를 생성
  // * 의존성 배열에
  //     number값이 들어가면 number값의 변경,
  //     객체가 들어간다면 객체 참조값의 변경
  //   에 의하여 함수가 재생성됨

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={useCallback(() => setMeowCount(n => n + 1), [])}/>
      <BarkButton onClick={useCallback(() => setBarkedCount(n => n + 1), [])}/>
    </div>
  );
}
