import { useState, memo } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";

interface ComponentProps {
  value: number;
}

const PureFunctionalCatComponent: React.FC<ComponentProps> = memo(
  ({ value }) => {
    return <Cat crying={value} />;
  }
);

const PureFunctionalDogComponent: React.FC<ComponentProps> = memo(
  ({ value }) => {
    return <Dog crying={value} />;
  }
);

// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.
export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  return (
    <div>
      <PureFunctionalCatComponent value={meowCount} />
      <PureFunctionalDogComponent value={barkedCount} />
      <button data-testid="meow" onClick={() => setMeowCount((n) => n + 1)}>
        야옹
      </button>
      <button data-testid="bark" onClick={() => setBarkedCount((n) => n + 1)}>
        멍멍
      </button>
    </div>
  );
}
