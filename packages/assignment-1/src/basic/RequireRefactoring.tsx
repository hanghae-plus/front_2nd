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
    return (
      <div
        {...props}
        style={{ width: "100px", height: "100px" }}
        onClick={() => {
          outerCount += 1;
        }}
      >
        {children}
      </div>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent countRendering={countRendering}>
      test component
    </PureComponent>
  );
}
