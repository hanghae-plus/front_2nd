import { cloneData, checkShallowObj } from "./utils";

/**얕은 비교를 수행하는 함수*/
export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return target1 === target2;
  }

  // Array일 때
  if ((Array.isArray(target1), Array.isArray(target2))) {
    return checkShallowObj(target1, target2);
  }

  // Object 생성자인지 확인
  if (target1.constructor !== Object && target2.constructor !== Object) {
    return false;
  }

  return checkShallowObj(target1, target2);
}

/**깊은 비교를 수행하는 함수*/
export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return target1 === target2;
  }

  const key1 = Object.keys(target1);
  const key2 = Object.keys(target2);

  // Array일 때
  if ((Array.isArray(target1), Array.isArray(target2))) {
    return (
      checkShallowObj(key1, key2) &&
      key1.every((key) => deepEquals(target1[key], target2[key]))
    );
  }

  // Object 생성자인지 확인
  if (target1.constructor !== Object && target2.constructor !== Object) {
    return false;
  }

  // Object일 때
  return (
    checkShallowObj(key1, key2) &&
    key1.every((key) => deepEquals(target1[key], target2[key]))
  );
}

/**number instance로 만드는 함수 */
export function createNumber1(n) {
  return new Number(n);
}

/**string instance로 만드는 함수*/
export function createNumber2(n) {
  return new String(n);
}

/**형 변환을 통해 hint에 따라 값을 반환하는 함수*/
export function createNumber3(n) {
  /**
   * 기본적으로 객체의 Symbol.toPrimitive()를 통해 원시값에 접근합니다. (하지만 Symbol객체와 Date객체만 보유하고 있음.)
   * Symbol.toPrimitive() 속서을 가지지 않는다면,
   * 내부적으로 객체의 기본적인 hint type은 number로 추론합니다. (default type = number)
   * hint가 number라면, valueOf -> toString 메서드 순으로 호출하고 호출이 가능하면 그 메서드를 호출하고 끝냅니다.
   * hint가 string이라면, toString -> valueOf 메서드 순서를 가지게 됩니다.
   * 메서드를 호출했지만, Object를 반환한다면 다음 메서드로 넘어가게 됩니다.
   */
  const obj = {
    valueOf: () => n,
    toJSON: () => `this is createNumber3 => ${n}`,
    toString: () => n,
  };

  return obj;
}

export class CustomNumber {
  /**정적 메서드로 Memo */
  static map = new Map();
  constructor(value) {
    if (CustomNumber.map.has(value)) {
      return CustomNumber.map.get(value);
    }

    CustomNumber.map.set(value, this);
    this.value = value;
  }
  valueOf() {
    return this.value;
  }
  toString() {
    return this.value;
  }
  toJSON() {
    return `${this.value}`;
  }
}

/**열거 할 수 없게 만드는 함수 */
export function createUnenumerableObject(target) {
  const copyTarget = cloneData(target);

  const objKey = Object.keys(copyTarget);

  objKey.forEach((key) => {
    Object.defineProperty(copyTarget, key, {
      enumerable: false,
    });
  });

  return copyTarget;
}

/**forEach함수 구현 */
export function forEach(target, callback) {
  const copyTarget = cloneData(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [key, value] = ele;

    //key나 value가 원본 number type이 키가 되면서 string이 될 수 있으므로 원본 값 부여
    const newKey = !isNaN(Number(key)) ? Number(key) : key;
    const newValue = !isNaN(Number(value)) ? Number(value) : value;

    callback(newValue, newKey);
  }
}

/**map함수 구현 */
export function map(target, callback) {
  const copyTarget = cloneData(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  //NodeList라면 array형태로 콜백 값 넣어주기
  if (target instanceof NodeList) {
    const newData = [];
    for (let ele of objArr) {
      const value = ele[1];
      const newValue = callback(value);
      newData.push(newValue);
    }
    return newData;
  } else {
    //array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기
    for (let ele of objArr) {
      const [key, value] = ele;
      const newValue = callback(value);
      copyTarget[key] = newValue;
    }

    return copyTarget;
  }
}

/**filter함수 구현 */
export function filter(target, callback) {
  const copyTarget = cloneData(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  //NodeList라면 array형태로 콜백 값 넣어주기
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
    //array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기
    const newData = {};
    for (let ele of objArr) {
      const [key, value] = ele;

      //callback filter조건을 통과하지 못하면 conrinue
      if (!callback(value)) {
        continue;
      }

      newData[key] = value;
    }

    //array일 경우 value만 뽑아서 return
    return Array.isArray(target) ? Object.values(newData) : newData;
  }
}

/**every함수 구현 */
export function every(target, callback) {
  const copyTarget = cloneData(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [, value] = ele;
    //요소가 하나라도 callback조건을 통과 못하면 return false
    if (!callback(value)) {
      return false;
    }
  }

  return true;
}

/**some함수 구현 */
export function some(target, callback) {
  const copyTarget = cloneData(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [, value] = ele;
    //요소가 하나라도 callback조건을 통과 못하면 return false
    if (callback(value)) {
      return true;
    }
  }

  return false;
}
