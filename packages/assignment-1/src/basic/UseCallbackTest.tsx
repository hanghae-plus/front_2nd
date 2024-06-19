import { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleMeowButtonClick = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, [setMeowCount]);

  const handleBarkButtonClick = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, [setBarkedCount]);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={handleMeowButtonClick} />
      <BarkButton onClick={handleBarkButtonClick} />
    </div>
  );
}
