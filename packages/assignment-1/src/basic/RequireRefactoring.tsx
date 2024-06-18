import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
}

// React는 성능 최적화를 위해 얕은 비교를 사용하여 객체의 참조 주소를 비교한다.
// 그 중 memo는 props가 변경될때마다 얕은 비교를 한다.
// 그래서 참조 타입의 경우 주소가 변경되면 props가 변경된 것으로 간주.
// 그래서 PureComponent가 memo를 썼지만 부모 컴포넌트에서 객체와 함수로 props를 넘겨주면 값이 같아도 리렌더링이 된다.
const PureComponent = memo(({ children, countRendering, ...props }: PropsWithChildren<ComponentProps<'div'> & Props>) => {
  countRendering?.();
  return <div {...props}>{children}</div>
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1

// 컴포넌트 밖에 정의한 객체나 함수같은 참조타입은 프로그램이 실행될때 한번 생성되어서
// 컴포넌트 안에서 밖에 정의된 객체를 사용해도 주소값은 같은곳을 바라보고 있기때문에 리렌더링을 방지할 수 있다.
const style = { width: '100px', height: '100px' }
const onClick = () => {
  outerCount += 1;
}

// 문제 : useMemo, useCallback 등을 사용하지 않고 이 컴포넌트를 개선해보세요.
export default function RequireRefactoring({ countRendering }: Props) {

  return (
    <PureComponent
      // 첫번째 문제점. 객체로 props를 전달하면 컴포넌트안의 객체는 항상 값은 같아도 새로 생성되기 때문에 다른 주소값을 가져서 새로운 객체로 간주해서 리렌더링됨.
      style={style}
      // 두번째 문제점. onClick에 전달된 함수도 참조타입이기 때문에 내용이 같더라도 새로운 함수로 간주해서 리렌더링됨.
      onClick={onClick}
      countRendering={countRendering}
    >
      test component
    </PureComponent>
  );
}

/** 내가 잘못 생각한것 : 왜 컴포넌트 안의 객체는 다른 주소값을 가지지?? react에서 일부러 다른 메모리 주소를 참조하게 해서 해당 컴포넌트의 리렌더링을 일으키기 위한건가??
 * 컴포넌트도 결국 하나의 함수라는것을 깜빡함..ㅠ
 * 컴포넌트는 함수이기 때문에 호출될때마다 새로운 실행컨텍스트를 생성한다.
 * 그래서 내부의 변수나 객체도 새로운 실행컨텍스트 내에서 새로 생성된다.
 * 그래서 동일한 코드라도 리렌더링하면 컴포넌트안의 참조타입들(객체, 배열, 함수 등)은 새로운 주소를 참조한다.
 */