import { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleReset = useCallback(() => {
    setMeowCount(meowCount + 1);
  }, []);

  const handleReset1 = useCallback(() => {
    setBarkedCount(barkedCount + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={handleReset} />
      <BarkButton onClick={handleReset1} />
    </div>
  );
}
