/*
  useRef는 리액트 훅의 한 종류로, Ref는 reference(참조)의 줄임말이다.
  useRef를 이용하면 특정한 DOM요소에 접근이 가능하면, 불필요한 재렌더링을 하지 않는다는 장점이 있다.

  .current 프로퍼티로 전달된 인자(initialValue)로 초기화된 변경 가능한 ref 객체를 반환합니다.
  반환된 객체는 컴포넌트의 전 생애주기를 통해 유지될 것입니다.

  반환된 useRef 객체는 컴포넌트의 전생애주기를 통해 유지가 된다.
  (= 컴포넌트가 계속해서 렌더링이 되어도 컴포넌트가 언마운드되기 전까지는 값을 그대로 유지할 수 있다)
  (= current 속성은 값을 변경해도 상태를 변경할 때 처럼 React 컴포넌트가 재렌더링 되지 않는다. )

  { current: initValue } 객채가 요소 EL의 참조객체
*/


/* [방법1: useState를 활용한 ref 상태 유지 ====================================================] */
// import {useState} from "react";
//
// export function useMyRef<T>(initValue: T | null) {
//   const [ref] = useState<{ current: T | null }>({ current: initValue });
//   return ref;
// }




/* [방법2-1: useMemo 활용해 객체로 ref 상태 유지 ====================================================] */
// import {useMemo} from "react";
//
// // { current: initValue } 를 저장할 변수 생성 => ex.) { '5w2x6cvqz': { current: 'initValue' } }
// const refStore: { [key: string]: any } = {};
//
// // { current: initValue } 를 저장할, 36진수의 난수화된 고유 키값을 생성
// const getUniqueId = () => {
//   return Math.random().toString().substr(2, 9);
// }
//
// export function useMyRef<T>(initValue: T | null) {
//   /*
//   *   useMemo 통해 고유한 ID를 생성합니다.
//   * - useMemo와 콜백함수를 이용해 난수를 생성하는 이유는 컴포넌트가 리렌더링될 때 동일한 refId를 사용할 수 있도록 보장하기 위함입니다.
//   * - useMemo를 사용하면 이전 계산 결과를 메모이제이션하여, 동일한 입력값이 주어질 때 다시 계산하지 않고 이전 값을 반환합니다.
//   * - 컴포넌트가 리렌더링되더라도 동일한 참조 객체를 유지할 수 있음.
//   * - 그렇지 않으면, 매 렌더링 시마다 새로운 refId가 생성되어, "참조 객체"가 일관되게 유지되지 않을 수 있음.
//   * */
//   const refId = useMemo(() => getUniqueId(), []);
//
//
//   // refStore에 고유한ID값을 할당후 ref참조
//   if (!refStore[refId]) {
//     refStore[refId] = { current: initValue };
//   }
//
//   const ref = refStore[refId];
//   return ref;
// }

/* [방법2-2: useMemo 활용해 배열로 ref 상태 유지 ====================================================] */
import {useMemo} from "react";

const refArray: object[] = [];

export function useMyRef<T>(initValue: T | null) {
  // 고유한 인덱스를 생성 및 유지
  const refIndex = useMemo(() => refArray.length, []);

  // refArray에 고유한 인덱스를 사용하여 참조 객체를 할당
  if (!refArray[refIndex]) {
    refArray[refIndex] = { current: initValue };
  }

  const ref = refArray[refIndex];
  return ref;
}