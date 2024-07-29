import React, { useState } from "react";
import { Cat, Dog } from "./PureComponentTest.components.tsx";

// Cat과 Dog를 PureComponent로 변환하여 불필요한 렌더링을 방지
class PureCat extends React.PureComponent {
  render() {
    return <Cat crying={this.props.crying} />;
  }
}

class PureDog extends React.PureComponent {
  render() {
    return <Dog crying={this.props.crying} />;
  }
}
// NOTE: 다른 파일은 수정하지 않고, 현재 파일만 수정하여 문제를 해결해주세요.
export default function PureComponentTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  return (
    <div>
      <PureCat crying={meowCount}/>
      <PureDog crying={barkedCount}/>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}
