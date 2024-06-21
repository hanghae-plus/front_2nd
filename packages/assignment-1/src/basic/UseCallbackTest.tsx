import {memo, useCallback, useState} from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

const MemoizedCat = memo(MeowButton);
const MemoizedDog = memo(BarkButton);

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const handleClickMeow = useCallback(()=> setMeowCount(n => n + 1), []);
  const handleClickBark = useCallback(()=> setBarkedCount(n => n + 1), []);

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MemoizedCat onClick={handleClickMeow}/>
      <MemoizedDog onClick={handleClickBark}/>
    </div>
  );
}
