import {useCallback, useState} from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const fooFunc = useCallback(() => setMeowCount(n => n + 1), [MeowButton])
  const fooFunc1 = useCallback(() => setBarkedCount(n => n + 1), [BarkButton])

  return (
    <div>
      <p data-testid="cat">meowCount {meowCount}</p>
      <p data-testid="dog">barkedCount {barkedCount}</p>
      <MeowButton onClick={fooFunc}/>
      <BarkButton onClick={fooFunc1}/>
    </div>
  );
}
