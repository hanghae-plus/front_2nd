import { ComponentProps, PropsWithChildren, memo, useCallback, useMemo, useState } from "react";
import { BarkButton, MeowButton } from "./UseCallbackTest.components.tsx";

const PureComponent = memo(({ children, ...props }: PropsWithChildren<ComponentProps<'p'>>) => {
  return <p {...props}>{children}</p>
})

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const callbackMeowCount = useCallback(
    ()=>{setMeowCount(n => n + 1)},[setMeowCount]
  )
    
  const callbackBarkCount = useCallback(
    ()=>{setBarkedCount(n => n + 1)},[setBarkedCount]
  )

  return (
    <div>
      <PureComponent data-testid='cat'>meowCount {meowCount}</PureComponent>
      <PureComponent data-testid='dog'>barkedCount {barkedCount}</PureComponent>
      <MeowButton onClick={callbackMeowCount}/>
      <BarkButton onClick={callbackBarkCount}/>
    </div>
  );
}
