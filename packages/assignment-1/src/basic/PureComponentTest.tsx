import { useState, memo} from "react";
import { Cat as CatComponent, Dog as DogComponent} from "./PureComponentTest.components.tsx";

// Cat,Dog jsx파일을 수정하지 않고 랜더링 이슈를 잡기위한 방법
const Cat = memo(CatComponent);
const Dog = memo(DogComponent);


// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.
export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);



  return (
    <div>
      <Cat crying={meowCount}/>
      <Dog crying={barkedCount}/>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}



