import {ComponentProps, memo, PropsWithChildren, useEffect, useState} from "react";

type Props = {
  countRendering?: () => void;
}

const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
    const [outerCount, setOuterCount] = useState(1)

  useEffect(() => {
    countRendering?.();
  }, [outerCount]);

  return <div {...props} onClick={()=> setOuterCount(n => n + 1)}>{children}</div>
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let outerCount = 1;

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
      <PureComponent
          style={{ width: '100px', height: '100px' }}
          countRendering={countRendering}
      >
        test component
      </PureComponent>
  );
}