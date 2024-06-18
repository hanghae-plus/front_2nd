import { useMemo } from 'react';

export function useMyRef<T>(initValue: T | null) {
  return useMemo(() => ({ current: initValue }), []);
}

/**
 * useRef는 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경할 수 있다.
 * useRef는 그 값이 변하더라도 렌더링을 발생시키지 않는다.
 * useRef 기본값은 useRef()로 넘겨받은 인수이며, 컴포넌트가 렌더링되어야 값이 바인딩된다.
 * 렌더링을 발생시키지 않고 원하는 상태값을 저장하고 싶을때 사용!
 *
 * 리렌더링 시 새로운 객체를 생성하는것을 방지하기 위하여 useMemo사용!
 */
