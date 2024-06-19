import { ComponentProps, memo, PropsWithChildren } from "react"; 
 
type Props = {
  countRendering?: () => void;
}

//React.memo(Component, [areEqual(prevProps, nextProps)]);
/**
 function moviePropsAreEqual(prevMovie, nextMovie) {
  return (
    prevMovie.title === nextMovie.title &&
    prevMovie.releaseDate === nextMovie.releaseDate
  );
}
 */
const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.children === nextProps.children 
      && prevProps.countRendering === nextProps.countRendering
      && prevProps.style?.width === nextProps.style?.width
      && prevProps.style?.height === nextProps.style?.height;
}


const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
  countRendering?.(); 
  return <div {...props}>{children}</div>
}, propsAreEqual)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;
 
/** */
const style = { width: '100px', height: '100px' };
const handleClick = () => {
  outerCount += 1;
};

export default function RequireRefactoring({ countRendering }: Props) {
 
  return (
    <PureComponent
      style={style}
      onClick={handleClick}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}
