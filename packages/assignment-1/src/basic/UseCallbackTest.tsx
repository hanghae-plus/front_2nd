import { useCallback, useState} from "react";
import { CryingButton, CryingCount } from "./UseCallbackTest.components.tsx";
import {callMeow, callBark} from "./UseCallbackTest.utils.tsx";


export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);


  const setMeow = useCallback(() => {
      setMeowCount(n => n + 1)
  }, [])

  const setBarked = useCallback(() => {
     setBarkedCount(n => n + 1)
  }, [])


  return (
    <div>
      <CryingCount cryingType="cat" text="meow" count={meowCount} />
      <CryingCount cryingType="dog" text="barked" count={barkedCount} />
      <CryingButton cryingType="meow" callbackFunc={callMeow} onClick={setMeow}/>
      <CryingButton cryingType="bark" callbackFunc={callBark} onClick={setBarked}/>
    </div>
  );
}
