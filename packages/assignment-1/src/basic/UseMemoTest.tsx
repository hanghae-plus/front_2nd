import {useMemo, useState} from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

    // 각 count를 기억하기 위한 함수
    function _useMemo(func:Function, count:number){
        return  useMemo(() => {
            return func(count)
        }, [count]);
    }


    const meow = _useMemo(repeatMeow, meowCount)
    const bark  = _useMemo(repeatBarked, barkedCount)

  return (
    <div>
      <p data-testid="cat">고양이 "{meow}"</p>
      <p data-testid="dog">강아지 "{bark}"</p>
      <button data-testid="meow" onClick={()=>{
          setMeowCount(n => n + 1)
      }}>
          야옹
      </button>
      <button data-testid="bark" onClick={()=>{
          setBarkedCount(n => n + 1)
      }}>
          멍멍
      </button>
    </div>
  );
}
