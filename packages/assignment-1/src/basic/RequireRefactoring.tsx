import {
  ComponentProps,
  memo,
  PropsWithChildren,
  useRef,
  useEffect,
} from "react";

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
  },
  (prev, next) => {
    return Object.is(prev.countRendering, next.countRendering);
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;

export default function RequireRefactoring({ countRendering }: Props) {
  const countRenderingRef = useRef(countRendering);

  useEffect(() => {
    countRenderingRef.current = countRendering;
  }, [countRendering]);

  const style = { width: "100px", height: "100px" };
  const handleClick = () => {
    outerCount += 1;
  };

  return (
    <PureComponent
      style={style}
      onClick={handleClick}
      countRendering={countRenderingRef.current}
    >
      test component
    </PureComponent>
  );
}
