let refArr: any = [];
let index = 0;

export function useMyRef<T>(initValue: T | null) {
  const localIndex = index;
  refArr.push({ current: initValue });
  // index++;
  return refArr[localIndex];
}

// export function useMyRef<T>(initValue: T | null) {
//   return { current: initValue };
// }
