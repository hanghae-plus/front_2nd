import React, { useState, useCallback } from 'react';
import { BarkButton, MeowButton } from './UseCallbackTest.components.tsx';

const MemoMeouButton = React.memo(MeowButton);
const MemoBarkButton = React.memo(BarkButton);

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const incrementMeowCount = useCallback(() => {
    setMeowCount(n => n + 1);
  }, []);

  const incrementBarkedCount = useCallback(() => {
    setBarkedCount(n => n + 1);
  }, []);

  return (
    <div>
      <p data-testid='cat'>meowCount {meowCount}</p>
      <p data-testid='dog'>barkedCount {barkedCount}</p>
      <MemoMeouButton onClick={incrementMeowCount} />
      <MemoBarkButton onClick={incrementBarkedCount} />
    </div>
  );
}
