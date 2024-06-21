import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
}

const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
  countRendering?.();
  return <div {...props}>{children}</div>
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1

// 컴포넌트의 리렌더링과 상관없는 객체나 함수는
// 컴포넌트 외부에서 선언하여 불필요한 리렌더링 방지 가능.
// => 내부에서 선언되었다면, 리렌더링 시마다 새로 생성되기 때문
// => 외부에서 선언되어있어도, 컴포넌트 내부에서 참조 가능
//      & 리렌더링 시마다 새로 생성되지 않음

const style = { width: '100px', height: '100px' };
const countUpOuterCount = () => { outerCount += 1; }

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent
      style={style}
      onClick={countUpOuterCount}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}
