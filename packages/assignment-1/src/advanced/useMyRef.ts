let refArr: any = [];
let index = 0;

export function useMyRef<T>(initValue: T | null) {
  let localIndex = index;
  index++;

  let target = null;

  for (let i = 0; i < refArr.length; i++) {
    if (refArr[i].current == initValue) {
      target = i;
      break;
    }
  }

  // refArr.find((item: any, index: number) => {
  //   if (item.current == initValue) {
  //     target = index;
  //     return true;
  //   }
  // });

  if (target !== null) {
    localIndex = target;
    index = localIndex + 1;
  } else {
    refArr.push({ current: initValue });
  }

  return refArr[localIndex];
}
