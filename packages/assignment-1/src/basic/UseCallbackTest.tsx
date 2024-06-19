import { useState, useCallback } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleClickMeow = useCallback(() => {
    setMeowCount((prevCount) => prevCount + 1);
  }, []);

  const handleClickBark = useCallback(() => {
    setBarkedCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={handleClickMeow} />
      <BarkButton onClick={handleClickBark} />
    </div>
  );
}
