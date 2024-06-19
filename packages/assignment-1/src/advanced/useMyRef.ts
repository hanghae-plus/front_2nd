import { useState } from 'react';

// let refArr: any = [];
// let index = 0;

export function useMyRef<T>(initValue: T | null) {
  const [ ref ] = useState({ current: initValue });
  return ref;

  // hook을 안 쓰고는 만들 수 없을까?
//   let localIndex = index;
//   index++;

//   let target = null;

// 반복문은 메모리를 너무 많이 차지할 거 같음...
//   for (let i = 0; i < refArr.length; i++) {
//     if (refArr[i].current == initValue) {
//       target = i;
//       break;
//     }
//   }

//   if (target !== null) {
//     localIndex = target;
//     index = localIndex + 1;
//   } else {
//     refArr.push({ current: initValue });
//   }

//   return refArr[localIndex];
}
