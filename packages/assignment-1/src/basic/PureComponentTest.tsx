import { useMemo, useState } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";
import React from "react";

// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.
const MemoizedCat = React.memo(Cat);
const MemoizedDog = React.memo(Dog);

function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  // meowCount와 barkedCount 값을 useMemo로 메모이제이션
  const memoizedMeowCount = useMemo(() => meowCount, [meowCount]);
  const memoizedBarkedCount = useMemo(() => barkedCount, [barkedCount]);

  return (
    <div>
      <MemoizedCat crying={memoizedMeowCount} />
      <MemoizedDog crying={memoizedBarkedCount} />
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}

export default React.memo(PureComponentTest);
