import { useMemo, useState } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  // useMemo를 사용하여 컴포넌트가 리렌더링 되더라도,
  // 상태값(meowCount, barkedCount)이 변경되지 않으면 함수를 다시 호출하지 않고 이전에 생성된 문자열을 사용

  // meowCount, barkedCount가 변경될 때만 함수가 호출
  // 변경 X => 이전에 생성된 문자열을 사용
  // 변경 O => 변경되면 새로운 문자열을 생성
  
  const meow = useMemo(() => repeatMeow(meowCount), [meowCount]); 
  const bark = useMemo(() => repeatBarked(barkedCount), [barkedCount]);

  return (
    <div>
      <p data-testid="cat">고양이 "{meow}"</p>
      <p data-testid="dog">강아지 "{bark}"</p>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}
