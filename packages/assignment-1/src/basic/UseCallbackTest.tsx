import React, { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default React.memo(function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const increaseMeowCount = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);
  const increaseBarkCount = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={increaseMeowCount} />
      <BarkButton onClick={increaseBarkCount} />
    </div>
  );
});
