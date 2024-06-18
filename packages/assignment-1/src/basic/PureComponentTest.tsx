import { ComponentProps, PropsWithChildren, memo, useCallback, useMemo, useState } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils";
// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.

const PureComponent = memo(({ children, ...props }: PropsWithChildren<ComponentProps<'p'>>) => {
  return <p {...props}>{children}</p>
})

export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  const callbackMeow = useCallback(()=>{
    setMeowCount(n => n + 1)
  },[setMeowCount])
  
  const callbackBark = useCallback(()=>{
    setBarkedCount(n => n + 1)
  },[setBarkedCount])

  const meow = useMemo(()=>repeatMeow(meowCount),[meowCount]) 
  const bark = useMemo(()=>repeatBarked(barkedCount),[barkedCount])

  return (
    <div>
      <PureComponent data-testid='cat'>고양이 "{meow}"</PureComponent>
      <PureComponent data-testid='dog'>강아지 "{bark}"</PureComponent>
      <button data-testid="meow" onClick={callbackMeow}>야옹</button>
      <button data-testid="bark" onClick={callbackBark}>멍멍</button>
    </div>
  );
}
