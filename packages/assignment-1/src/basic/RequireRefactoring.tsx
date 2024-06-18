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

// 고정된 스타일 객체
const fixedStyle = { width: "100px", height: "100px" };

// 고정된 핸들 클릭 함수
let outerCount = 1;
const fixedHandleClick = () => {
  outerCount += 1;
};

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
const RequireRefactoring = ({ countRendering }: Props) => {
  return (
    <PureComponent
      style={fixedStyle}
      onClick={fixedHandleClick}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
};

export default RequireRefactoring;
