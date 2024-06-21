import { useMemo, useState } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  const memoizedMeow = useMemo(() => repeatMeow(meowCount), [meowCount]);
  const memoizedBark = useMemo(() => repeatBarked(barkedCount), [barkedCount]);

  return (
    <div>
      <p data-testid="cat">고양이 "{memoizedMeow}"</p>
      <p data-testid="dog">강아지 "{memoizedBark}"</p>
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}
