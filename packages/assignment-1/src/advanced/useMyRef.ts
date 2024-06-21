import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  // useRef와 같이 초기값을 메모이제이션하여,
  // initValue값이 변경될때만 current 프로퍼티에 할당하여 반환.
  // useRef와 동작상 차이 : useRef는 current값이 변경되어도 리렌더링을 일으키지 않지만, (컴포넌트의 생명주기 동안 동일한 객체를 참조하므로)
  //                       useMyRef는 current값이 변경되면 리렌더링을 일으킨다. (새로운 객체를 생성했으므로)


  const before = useMemo(() => ({ current: initValue }), [initValue]);
  
  return before;

}