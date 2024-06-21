import React, { useCallback, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const onClickMeow = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);
  const onClickBark = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);
  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <PureMeowButton onClick={onClickMeow} />
      <PureBarkButton onClick={onClickBark} />
    </div>
  );
}

const PureMeowButton = React.memo(MeowButton);
const PureBarkButton = React.memo(BarkButton);
