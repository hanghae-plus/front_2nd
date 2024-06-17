import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;
const divStyle = { width: "100px", height: "100px" };

const PureComponent = memo(
  ({
    children,
    countRendering,
  }: PropsWithChildren<ComponentProps<"div"> & Props>) => {
    countRendering?.();

    const clickHandler = () => {
      outerCount += 1;
    };

    return (
      <div style={divStyle} onClick={clickHandler}>
        {children}
      </div>
    );
  }
);

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent countRendering={countRendering}>
      test component
    </PureComponent>
  );
}
