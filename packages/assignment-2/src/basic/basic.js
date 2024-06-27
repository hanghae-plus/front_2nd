export function shallowEquals(target1, target2) {
  // 객체가 서로 다른 메모리를 참조하고 있어서 값이 같아도 false가 되는게 문제.
  // 어떻게 객체의 값이 같다면 얕은 비교로 true을 반환하게 할 수 있을까?

  // 원시 데이터 타입 비교
  if(Object.is(target1,target2)) return true;

  // 익명 class 조건
  // 익명 class는 이름을 가지지 않는다. 
  if ((typeof target1 === 'object' && !target1.constructor.name)
    || (typeof target2 === 'object' && !target2.constructor.name)) {
    return false;
  }

  // new 생성자 객체 조건
  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  // 값이 있는 두 배열([1,2,3]) 타입 비교 - 배열은 값 비교가 필요.
  if(Array.isArray(target1) && Array.isArray(target2)){
    if (target1.length !== target2.length) {
      return false;
    }

    for(let i=0; i<target1.length; i++){
      if(!Object.is(target1[i], target2[i])) return false;
    }
  }

  // 참조 데이터({},[]) 타입 비교
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  for(let i=0; i<target1Keys.length; i++){
    const currentKey = target1Keys[i];

    // 만약에 target2에 i번째 target1Key 속성이 없거나,
    // target1 currentKey의 값과 target2 currentKey의 값이 같지 않으면 false
    if(!Object.hasOwnProperty.call(target2, currentKey) || !Object.is(target1[currentKey], target2[currentKey])){
      return false;
    }
  }

  return true;
}

export function deepEquals(target1, target2) {

  // 깊은 비교는 안쪽 참조타입까지 싹다 비교를 해야함.
  // 재귀를 이용해서 안쪽 참조타입까지 돌려보자.

  // 원시 데이터 타입 비교
  if(Object.is(target1,target2)) return true;

  // null 검사 및 객체 타입 검사
  if (typeof target1 !== 'object' || typeof target2 !== 'object' || target1 === null || target2 === null) {
    return false;
  }

  // 익명 class 조건
  // 익명 class는 이름을 가지지 않는다. 
  if ((typeof target1 === 'object' && !target1.constructor.name)
    || (typeof target2 === 'object' && !target2.constructor.name)) {
    return false;
  }

  // new 생성자 객체 조건
  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  // 값이 있는 두 배열([1,2,3]) 타입 비교 - 배열은 값 비교가 필요.
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;

    for (let i = 0; i < target1.length; i++) {
      if (!deepEquals(target1[i], target2[i])) {
        return false;
      }
    }
    return true;
  }

  // 참조 데이터({},[]) 타입 깊은 비교
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  for (let key of target1Keys) {
    if (!Object.hasOwnProperty.call(target2, key) || !deepEquals(target1[key], target2[key])) {
      return false;
    }
  }
  
  return true;
}

/** typeof가 object인게 true니까 들어오는 값을 new Number로 type을 object로 만들기 */
export function createNumber1(n) {
  return new Number(n);
}

/** string처럼 붙는데, type이 object. */
export function createNumber2(n) {
  return new String(n);
}

/** 객체가 숫자컨텍스트(객체가 숫자로 변환되어야 하는 상황)에서 사용될 때 객체에 valueOf 메서드가 정의되어 있으면
 * 'valueOf'메서드가 자동으로 호출되어 메서드의 return 값으로 연산.
 * 숫자컨텍스트 발생 : 수학 연산, 비교 연산, 단항 연상
 * JSON.stringify로 문자열 변환을 시도하면 toJSON 메소드가 실행되고,
 * 문자열 컨텍스트에서는 toString 메소드가 실행된다.
**/
export function createNumber3(n) {
  return {
    value: n,
    valueOf: function() {
        return this.value;
    },
    toJSON: function() {
        return `this is createNumber3 => ${this.value}`;
    },
    toString: function() {
        return `${this.value}`;
    }
};
}

/** 같은 참조를 바라봐야 하는 조건을 위해 new Map으로 객체를 캐싱한다.
 * 객체를 생성할때 캐시를 확인해서 이전과 동일한 객체가 있을때 그 객체를 반환한다.
 * 동일한 객체가 없을때는 새로운 객체를 생성하고 Map에 캐싱한다.
 */
export class CustomNumber {
  static cache = new Map();

  constructor(n){
    if (CustomNumber.cache.has(n)) {
      return CustomNumber.cache.get(n);
    }

    this.value = n;
    CustomNumber.cache.set(n, this);
  }

  valueOf() {
    return this.value;
  }

  toJSON(){
    return `${this.value}`;
  }

  toString(){
    return `${this.value}`;
  }
}

/** Object.defineProperty : js의 객체의 속성을 정의하거나 수정할때 사용되는 메서드
 * 빈 객체가 아니지면 얕은 복사를 할땐 빈 객체와 같아야 할때 Object.defineProperty로
 * 직접 접근할수는 있지만 각 속성을 루프, 메서드에 의해 열거(객체의 속성을 반복해서 나열)할 수 없게 만들어준다.
 */
export function createUnenumerableObject(target) {
  const result = {};
  Object.keys(target).forEach(key => {
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true
    });
  });
  return result;
}

/** 객체, 배열, 유사배열 순회 하면서 각 요소에 대해 콜백함수를 실행 */
export function forEach(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i, target);
    }
  } else if (typeof target === 'object' && target !== null) {
    const keys = Object.keys(target).concat(Object.getOwnPropertyNames(target).filter(key => !Object.keys(target).includes(key)));
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        callback(target[key], key, target);
      }
    }
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    const result = [];
    forEach(target, (value, key) => {
      result.push(callback(value, key, target));
    });
    return result;
  } else if (typeof target === 'object' && target !== null) {
    const result = {};
    forEach(target, (value, key) => {
      result[key] = callback(value, key, target);
    });
    return result;
  }
}

export function filter(target, callback) {
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    const result = [];
    forEach(target, (value, key) => {
      if (callback(value, key, target)) {
        result.push(value);
      }
    });
    return result;
  } else if (typeof target === 'object' && target !== null) {
    const result = {};
    forEach(target, (value, key) => {
      if (callback(value, key, target)) {
        result[key] = value;
      }
    });
    return result;
  }
}

export function every(target, callback) {
  let allMatch = true;
  forEach(target, (value, key) => {
    if (!callback(value, key, target)) {
      allMatch = false;
    }
  });
  return allMatch;
}

export function some(target, callback) {
  let anyMatch = false;
  forEach(target, (value, key) => {
    if (callback(value, key, target)) {
      anyMatch = true;
    }
  });
  return anyMatch;
}

