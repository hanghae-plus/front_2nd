import { memo, useState } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";

// memo함수를 이용하여, 컴포넌트의 props가 변경되지 않으면 렌더링 방지

// meow 또는 bark 버튼을 클릭 -> 해당count증가 -> props변경 -> 리렌더링 O
// meowCount, barkedCount가 변경되지 않으면 리렌더링 X

// React.memo에 의하여 Cat/Dog 컴포넌트는 특별한 기능이 붙게 됨(= 고차컴포넌트-HOC-로 변환됨)
// ( 특별한 기능 : 컴포넌트의 props가 변경되지 않으면 렌더링 방지)

const CatComponent = memo(Cat); 
const DogComponent = memo(Dog); 

// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.
export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);
  
  return (
    <div>
      <CatComponent crying={meowCount}/>
      <DogComponent crying={barkedCount}/>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}
