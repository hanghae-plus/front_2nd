import { ComponentProps, memo, PropsWithChildren, useState } from "react";

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
export default function RequireRefactoring({ countRendering }: Props) {
  const [counterRenderingState] = useState(countRendering);

  const handleCountRendering = () => {
    if (counterRenderingState !== countRendering) {
      return counterRenderingState;
    }
    return countRendering;
  };

  return (
    <PureComponent
      style={{ width: "100px", height: "100px" }}
      onClick={() => {
        outerCount += 1;
      }}
      countRendering={handleCountRendering}
    >
      test component
    </PureComponent>
  );
}
