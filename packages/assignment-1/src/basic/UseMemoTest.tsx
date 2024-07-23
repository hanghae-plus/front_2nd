import { useState, useMemo  } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  // useMemo를 사용하여 meowCount가 변경될 때만 repeatMeow를 호출
  const meow = useMemo(() => repeatMeow(meowCount), [meowCount]);
  // useMemo를 사용하여 barkedCount가 변경될 때만 repeatBarked를 호출
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
