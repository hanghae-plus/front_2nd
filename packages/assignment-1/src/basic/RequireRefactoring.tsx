import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
};

const PureComponent = memo(
  ({
    children,
    countRendering,
    ...props
  }: PropsWithChildren<ComponentProps<"div"> & Props>) => {
    countRendering?.();
    return <div {...props}>{children}</div>;
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;
const outerStyle = { width: "100px", height: "100px" };
const outerClickHanlder = () => (outerCount += 1);

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  // PureComponent 입장에선 새 props가 전달된 것이기에 리렌더링된다.
  return (
    <PureComponent
      style={outerStyle}
      onClick={outerClickHanlder}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}
