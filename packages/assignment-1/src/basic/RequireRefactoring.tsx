import {ComponentProps, memo, PropsWithChildren} from "react";
/*
*
* React에서는 컴포넌트가 새로운 props를 받으면 변경된 props가 있는지 얕은 비교를 수행합니다.
* 렌더링할 때마다 새로운 객체나 함수가 생성되면 참조가 변경되어 React가 prop이 변경되었다고 생각하게 되어 다시 렌더링됩니다.
*
* 불필요한 재렌더링을 방지하려면 실제 콘텐츠가 변경되지 않는 한 구성 요소에 전달된 prop이 안정적인 참조를 갖도록 해야 합니다. 이를 달성하는 방법은 다음과 같습니다.
*
* 1. 개체, 배열 또는 함수를 구성 요소 외부로 이동하면 해당 참조가 명시적으로 변경되지 않는 한 렌더링 전체에서 동일하게 유지됩니다.
* */
type Props = {
  countRendering?: () => void;
}

const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
  countRendering?.();
  return <div {...props}>{children}</div>
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1

const style = { width: '100px', height: '100px' };

const handleClick = () => {
  outerCount += 1;
};


// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent
      style={style}
      onClick={handleClick}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}
