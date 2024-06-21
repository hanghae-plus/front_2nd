import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState(() => ({ current: initValue }))
  return ref;
}

// useState를 통해 참조 객체를 초기화
// initValue를 current 속성으로 가진 객체를 생성하고, 이를 상태로 관리
// useState로 초기화된 참조 객체는 컴포넌트가 재렌더링되더라도 동일한 메모리 위치를 유지