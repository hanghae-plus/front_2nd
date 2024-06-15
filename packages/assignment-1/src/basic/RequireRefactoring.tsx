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

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
const RequireRefactoring = memo(({ countRendering }: Props) => {
  return (
    <PureComponent
      style={{ width: "100px", height: "100px" }}
      onClick={() => {
        outerCount += 1;
      }}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
});

export default RequireRefactoring;
