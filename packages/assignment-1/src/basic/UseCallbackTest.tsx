import { memo, useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

const MemoizedMeowButton = memo(MeowButton);
const MemoizedBarkButton = memo(BarkButton);

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleMeowButtonClick = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);

  const handleBarkButtonClick = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MemoizedMeowButton onClick={handleMeowButtonClick} />
      <MemoizedBarkButton onClick={handleBarkButtonClick} />
    </div>
  );
}
