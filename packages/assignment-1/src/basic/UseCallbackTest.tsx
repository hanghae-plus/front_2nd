import { useState, PureComponent, useCallback } from 'react';
import { BarkButton, MeowButton } from './UseCallbackTest.components.tsx';

class PureComp extends PureComponent<any, any> {
  render() {
    return (
      <p data-testid={this.props.id}>
        {this.props.text} {this.props.count}
      </p>
    );
  }
}

export default function UseCallbackTest() {
  const [meowCount, setMeowCount] = useState(0);
  const [barkedCount, setBarkedCount] = useState(0);

  const onMeowClick = useCallback(() => {
    setMeowCount((n) => n + 1);
  }, []);
  const onBarkClick = useCallback(() => {
    setBarkedCount((n) => n + 1);
  }, []);

  return (
    <div>
      <PureComp id='cat' text='meowCount' count={meowCount} />
      <PureComp id='dog' text='barkedCount' count={barkedCount} />
      <MeowButton onClick={onMeowClick} />
      <BarkButton onClick={onBarkClick} />
    </div>
  );
}
