import {useEffect, useState} from "react";

export default function UseEffectTest({ callback }: { callback: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
      callback();
  }, []);

  return (
    <div>
      <p>count {count}</p>
      <button onClick={() => setCount(n => n + 1)}>up</button>
    </div>
  );
}
