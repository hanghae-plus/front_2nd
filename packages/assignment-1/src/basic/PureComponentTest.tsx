import { useState, memo } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";

const MemoizedCat = memo(Cat);
const MemoizedDog = memo(Dog);

export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  return (
    <div>
      <MemoizedCat crying={meowCount} />
      <MemoizedDog crying={barkedCount} />
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}
