/**
 * @NOTE
 * 1. 원시값 비교
 * 2. Array 비교
 * 3. 객체 비교
 * @param {*} target1
 * @param {*} target2
 * @returns
 */
export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (Array.isArray(target1) && Array.isArray(target2) && target1.length === target2.length) {
    return target1.every((value, idx) => value === target2[idx]);
  }

  if (target1.constructor === Object && target2.constructor === Object) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => target1[key] === target2[key]);
  }

  return false;
}

/**
 * @NOTE 얕은 비교를 재귀로 호출하여 객체를 깊은 비교한다.
 * @param {*} target1
 * @param {*} target2
 * @returns
 */
export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (Array.isArray(target1) && Array.isArray(target2) && target1.length === target2.length) {
    return target1.every((value, idx) => deepEquals(value, target2[idx]));
  }

  if (target1.constructor === Object && target2.constructor === Object) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => deepEquals(target1[key], target2[key]));
  }

  return false;
}

/**
 * @NOTE 객체의 연산 순서 => toPrimitive => valueOf => toString
 * @param {*} n
 * @returns
 */
export function createNumber1(n) {
  const numberObj = {
    value: n,
    // 객체끼리 비교 => default, 숫자연산 => number
    //+ num1 + +num2 => number default number
    [Symbol.toPrimitive](hint) {
      //number
      if (hint === "number") {
        return this.value;
      }
      //defualt
      return this.value;
    },
    // [Symbol.toPrimitive]가 없을 경우, valueOf => toString
    // valueOf() {
    //   return this.value;
    // },
    // toString() {
    //   return this.value + "";
    // },
  };

  return numberObj;
}

/**
 * 객체의 연산 순서 => toPrimitive => valueOf => toString
 * 객체 안에 메소드를 정의할 경우 덮어 쓰여지게 된다.
 */
export function createNumber2(n) {
  const numberObj = {
    value: n,
    valueOf() {
      return `${this.value}`;
    },
    toString() {
      return `${this.value}`;
    },
  };

  return numberObj;
}

/**
 * 숫자비교 연산 => valueOf() 호출
 * stringify => toJSON() 호출
 * ``메소드 => toString() 호출
 */
export function createNumber3(n) {
  const numberObj = {
    value: n,
    valueOf() {
      return this.value;
    },
    toString() {
      return `${this.value}`;
    },
    toJSON() {
      return `this is createNumber3 => ${this.value}`;
    },
  };

  return numberObj;
}

export class CustomNumber {
  static #dataMap = new Map();
  number;

  constructor(n) {
    if (CustomNumber.#dataMap.has(n)) {
      return CustomNumber.#dataMap.get(n);
    }
    this.number = n;
    CustomNumber.#dataMap.set(n, this);
    return this;
  }

  valueOf() {
    return this.number;
  }
  toString() {
    return `${this.number}`;
  }
  toJSON() {
    return `${this.number}`;
  }
}

/**
 * @NOTE
 * Object.getOwnPropertyNames vs Object.keys차이점
 * getOwnPropertyNames : 열거 가능 + 불가능한 모든 속성 이름
 * keys : 열거 가능한 모든 속성 이름
 * @param {*} target
 * @returns
 */
export function createUnenumerableObject(target) {
  //freeze => 속성 추가, 삭제, 변경 불가능 configurable, writable : false
  //seal=> 속성을 추가, 삭제할 수 없다.(변경 가능) configurable : false
  const propertyNames = Object.getOwnPropertyNames(target);

  /**
   * @NOTE
   * 프로퍼티 플래그 3개 속성
   * configurable => 속성 삭제, 플래그 수정 가능 여부.
   * enumeralbe => 속성 열거 가능 여부
   * writable => 속성 값을 수정 가능 여부
   */
  for (let name of propertyNames) {
    let value = target[name];
    Object.defineProperty(target, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }

  return target;
}

/**
 * 기존 객체의 주소값을 유지하면서 callback을 실행
 * @param {*} target
 * @param {*} callback
 */
export function forEach(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else {
    // keys를 하면 열거가능한 속성만, getOwnPropertyNames는 열거 불가능한 속성도 포함
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = target[key];
      callback(value, key);
    }
  }
}

/**
 * callback을 실행한 새로운 결과값을 반환한다.
 * @param {*} target
 * @param {*} callback
 * @returns
 */
export function map(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    const newArr = [];
    for (let i = 0; i < target.length; i++) {
      newArr.push(callback(target[i], i));
    }
    return newArr;
  } else {
    // keys를 하면 열거가능한 속성만, getOwnPropertyNames는 열거 불가능한 속성도 포함
    const keys = Object.getOwnPropertyNames(target);
    const newObj = {};
    // const newObj = new Object();
    // const newObj = Object.create();
    // const newObj = Object();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = target[key];
      Object.assign(newObj, { [key]: callback(value, key) });
    }
    return newObj;
  }
}

/**
 * callback 조건에 맞는 새로운 결과값을 반환한다.
 * @param {*} target
 * @param {*} callback
 */
export function filter(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    const newArr = [];
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        newArr.push(target[i]);
      }
    }
    return newArr;
  } else {
    // keys를 하면 열거가능한 속성만, getOwnPropertyNames는 열거 불가능한 속성도 포함
    const keys = Object.getOwnPropertyNames(target);
    const newObj = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = target[key];
      if (callback(value, key)) {
        Object.assign(newObj, { [key]: value });
      }
    }
    return newObj;
  }
}

//callback의 조건이 모두 만족하는지 결과값을 반환
export function every(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
  } else {
    // keys를 하면 열거가능한 속성만, getOwnPropertyNames는 열거 불가능한 속성도 포함
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = target[key];
      if (!callback(value, key)) {
        return false;
      }
    }
  }
  return true;
}

//callback의 조건중 하나라도 만족하는지 결과값을 반환
export function some(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
  } else {
    // keys를 하면 열거가능한 속성만, getOwnPropertyNames는 열거 불가능한 속성도 포함
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = target[key];
      if (callback(value, key)) {
        return true;
      }
    }
  }
  return false;
}
