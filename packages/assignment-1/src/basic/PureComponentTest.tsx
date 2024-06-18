import { useState, memo } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";
// import { Cat, Dog } from "./PureComponentTest.components.tsx";

type TCryingProps = {
  crying: number;
}
const Dog = memo(function Dog({ crying }: TCryingProps) {
  return (
    <p data-testid="dog">강아지 "{repeatBarked(crying)}"</p>
  );
})

const Cat = memo(function Cat({ crying }: TCryingProps) {
  return (
    <p data-testid="cat">고양이 "{repeatMeow(crying)}"</p>
  );
})
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
