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

// 스타일과 핸들러를 컴포넌트 외부에서 정의
const fixedStyle = { width: "100px", height: "100px" };
const handleClick = () => {
  outerCount += 1;
};

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent
      style={fixedStyle}
      onClick={handleClick}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}
