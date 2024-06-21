import React, { useState } from "react";
import {
  Cat as OriginalCat,
  Dog as OriginalDog,
} from "./PureComponentTest.components.tsx";

// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.

// 외부에서 지정 필요
const Cat = React.memo(OriginalCat);
const Dog = React.memo(OriginalDog);

export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  return (
    <div>
      <Cat crying={meowCount} />
      <Dog crying={barkedCount} />
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}
