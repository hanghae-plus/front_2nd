import { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const meowCountHandler = useCallback(() => setMeowCount((n) => n + 1), []);
  const barkedCountHandler = useCallback(
    () => setBarkedCount((n) => n + 1),
    []
  );

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      {/* <MeowButton onClick={() => setMeowCount((n) => n + 1)} />
      <BarkButton onClick={() => setBarkedCount((n) => n + 1)} /> */}
      <MeowButton onClick={meowCountHandler} />
      <BarkButton onClick={barkedCountHandler} />
    </div>
  );
}
