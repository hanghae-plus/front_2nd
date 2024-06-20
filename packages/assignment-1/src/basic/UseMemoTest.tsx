import { useState, useMemo } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  const meow = useMemo(() => repeatMeow(meowCount), [meowCount]);
  const bark = useMemo(() => repeatBarked(barkedCount), [barkedCount]);
  //useMemo는 특정값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았으면 이전에 연상했떤 결과를 다시 사용하는 방식

  return (
    <div>
      <p data-testid="cat">고양이 "{meow}"</p>
      <p data-testid="dog">강아지 "{bark}"</p>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}
