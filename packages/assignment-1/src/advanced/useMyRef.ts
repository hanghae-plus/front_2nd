/*
  { current: initValue } 객채가 요소 EL의 참조객체
*/


/* [방법1: useState를 활용한 ref 상태 유지 ====================================================] */
// import {useState} from "react";
//
// export function useMyRef<T>(initValue: T | null) {
//   const [ref] = useState<{ current: T | null }>({ current: initValue });
//   return ref;
// }




/* [방법2: useMemo, useEffect를 활용한 ref 상태 유지 ====================================================] */
import {useMemo, useEffect} from "react";

// { current: initValue } 를 저장할 변수 생성 => ex.) { '5w2x6cvqz': { current: 'initValue' } }
const refStore: { [key: string]: any } = {};

// { current: initValue } 를 저장할, 36진수의 난수화된 고유 키값을 생성
const getUniqueId = () => {
  return Math.random().toString().substr(2, 9);
}

export function useMyRef<T>(initValue: T | null) {
  // useMemo 통해 고유한 ID를 생성합니다.
  const refId = useMemo(() => getUniqueId(), []);

  // refStore에 고유한ID값을 할당후 ref참조
  if (!refStore[refId]) {
    refStore[refId] = { current: initValue };
  }

  const ref = refStore[refId];

  // 컴포넌트가 언마운트될 때 refStore에서 해당 ref참조를 삭제합니다.
  useEffect(() => {
    return () => {
      delete refStore[refId];
    };
  }, [refId]);

  return ref;
}
