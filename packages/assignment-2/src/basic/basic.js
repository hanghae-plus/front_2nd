export function shallowEquals(target1, target2) {
  console.log(typeof target1, target1, target2);

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  return target1 === target2;
}

export function createNumber1(n) {
  return Number(n);
}

export function createNumber2(n) {
  return Number(n);
  // return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {
  let copyTarget;

  /**해당 데이터가 어떤 타입의 데이터인지 판별하는 함수 */
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  copyTarget = checkDataType(target);

  /**object key,value 뽑기 */
  const objArr = Object.entries(copyTarget);

  /**NodeList라면 array형태로 콜백 값 넣어주기 */
  if (target instanceof NodeList) {
    const newData = [];
    for (let ele of objArr) {
      const value = ele[1];
      const newValue = callback(value);
      newData.push(newValue);
    }
    return newData;
  } else {
    /**array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기 */
    for (let ele of objArr) {
      const [key, value] = ele;
      const newValue = callback(value);
      copyTarget[key] = newValue;
    }

    return copyTarget;
  }
}

export function filter(target, callback) {
  let copyTarget;

  /**해당 데이터가 어떤 타입의 데이터인지 판별하는 함수 */
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  copyTarget = checkDataType(target);

  /**object key,value 뽑기 */
  const objArr = Object.entries(copyTarget);

  /**NodeList라면 array형태로 콜백 값 넣어주기 */
  if (target instanceof NodeList) {
    const newData = [];
    for (let ele of objArr) {
      const value = ele[1];
      if (!callback(value)) {
        continue;
      }
      newData.push(value);
    }
    return newData;
  } else {
    /**array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기 */
    const newData = {};
    for (let ele of objArr) {
      const [key, value] = ele;

      /**callback filter조건을 통과하지 못하면 conrinue */
      if (!callback(value)) {
        continue;
      }

      newData[key] = value;
    }

    /**array일 경우 value만 뽑아서 return */
    return Array.isArray(target) ? Object.values(newData) : newData;
  }
}

export function every(target, callback) {}

export function some(target, callback) {}
