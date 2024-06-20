import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
}

const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
  countRendering?.();
  return <div {...props}>{children}</div>
<<<<<<< HEAD
})
=======
});
>>>>>>> 8d60bb2a28c4c53eb92efd0ae9e77e45d6912d83

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1

<<<<<<< HEAD
const fixedStyle = { width: '100px', height: '100px' };

const handleClick = () => {
  outerCount += 1;
};

// useMemo, useCallback, memo 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({countRendering }: Props) {
  return (
    <PureComponent
      style={fixedStyle}
      onClick={handleClick}
=======
// useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
const RequireRefactoring = memo(({ countRendering }: Props) => {
  return (
    <PureComponent
      style={{ width: '100px', height: '100px' }}
      onClick={() => {outerCount += 1;}}
>>>>>>> 8d60bb2a28c4c53eb92efd0ae9e77e45d6912d83
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
<<<<<<< HEAD
}
=======
});

export default RequireRefactoring;
>>>>>>> 8d60bb2a28c4c53eb92efd0ae9e77e45d6912d83
