import { ComponentProps, PropsWithChildren, useState } from "react";

type Props = {
  countRendering?: () => void;
};

const PureComponent = ({
  children,
  countRendering,
  ...props
}: PropsWithChildren<ComponentProps<"div"> & Props>) => {
  // 조건문을 통해 함수 실행 여부 첫 결정, 그 후 비활성화 (truthy)
  const [isRendered, setIsRendered] = useState(false);

  if (!isRendered) {
    countRendering?.();
    setIsRendered(true);
  }

  return <div {...props}>{children}</div>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;

// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {
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
}
