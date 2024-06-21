import React, { useState, memo, useCallback } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

const PureCatComponent = memo(MeowButton);
const PureDogComponent = memo(BarkButton);
export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const generateMeowCount = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);

  const generateBarkedCount = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <PureCatComponent onClick={generateMeowCount} />
      <PureDogComponent onClick={generateBarkedCount} />
    </div>
  );
}
