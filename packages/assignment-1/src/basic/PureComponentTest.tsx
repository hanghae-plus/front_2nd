import { memo, useState } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";

// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.

const MemoCat = memo(Cat);
const MemoDog = memo(Dog);

export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  return (
    <div>
      <MemoCat crying={meowCount} />
      <MemoDog crying={barkedCount} />
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}
