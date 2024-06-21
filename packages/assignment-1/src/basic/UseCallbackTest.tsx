import { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleMeowCount = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);

  const handleBarkedCount = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={handleMeowCount}/>
      <BarkButton onClick={handleBarkedCount}/>
      {/* 동일하게 렌더링이 일어날 때마다 함수가 다시 실행되고 있었음 */}
    </div>
  );
}
