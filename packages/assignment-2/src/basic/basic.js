// Static method는 클래스 레벨에서 동작하고, prototype method는 인스턴스 레벨에서 동작함.

export function shallowEquals(target1, target2) {
  // target1,2의 type의 구분이 필요, ex) class로 만든 인스턴스, object, arr, primitive type;
  // 출제의도: 어떤 방법으로 만들어진 자료형인지 아는 것과, 내용을 비교하는 방식을 아는지.
  if (target1 === target2) return true;
  // 원시 자료형은 값과 타입이 모두 같은지 비교.
  // 참조 자료형은 같은 주소를 참조 하는지 비교.

  if (typeof target1 !== "object" || typeof target2 !== "object") return false;

  // new Number 나 new String에 의해 만들어진 값인지 확인하는 방법.
  // ex) const a = new Number(1), const b = 1;
  // a instanceOf Number ==> true; b instanceOf Number ==> false;
  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String)
  )
    return false;

  // 배열일때 비교하는 방법
  // 1. 길이 비교
  // 2. 순회하여 각 인덱스의 값들이 같은지 비교.
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) return false;
    }
    return true;
  }
  // object일때 비교하는 방법

  // __proto__.constructor === Object 는 Object 생성자 함수에서 생성되었는지 확인하는 방법.
  if (
    target1.__proto__.constructor !== Object &&
    target2.__proto__.constructor !== Object
  ) {
    return target1.__proto__.constructor === target2.__proto__.constructor;
  }

  // 모든 키 순회 할 수 있게 배열로 만들어 값 비교.
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) return false;

  for (let i = 0; i < target1Keys.length; i++) {
    if (target1[target1Keys[i]] !== target2[target2Keys[i]]) {
      return false;
    }
  }

  return true;
}

export function deepEquals(target1, target2) {
  // 출제의도: 제귀함수를 만들 수 있는지, depth의 마지막을 찾을 수 있는지.
  // 목표: target1과 target2를 순회하면서 depth(깊이) 파악하기.
  // 깊이를 파악하기 전까지 shallowEqual함수를 return.
  // 마지막 깊이에 도달하면 return을 반환.
  // ex) 팩토리얼 함수.
  // 5! =
  // const factorial = (n) =>{
  //   if (n > 0) {
  //     return n * factorial(n-1);
  //   } else return 1;
  // }

  // 원시 값이면 true, 객체나 배열이면 false 반환
  if (target1 === target2) return true;
  function toCheckPrim(value) {
    return value !== Object(value);
  }

  // 타입이 다르면 false 반환
  if (
    typeof target1 !== "object" ||
    typeof target2 !== "object" ||
    target1 === null ||
    target2 === null
  ) {
    return false;
  }

  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String)
  )
    return false;

  if (typeof target1 !== "object" || typeof target2 !== "object") return false;

  // 배열 비교
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    for (let i = 0; i < target1.length; i++) {
      if (!toCheckPrim(target1[i] && !toCheckPrim(target2[i]))) {
        if (!deepEquals(target1[i], target2[i])) return false;
      }
    }
    return true;
  }

  // 객체 비교

  if (
    target1.__proto__.constructor !== Object &&
    target2.__proto__.constructor !== Object
  ) {
    return target1.__proto__.constructor === target2.__proto__.constructor;
  }

  const toArray1 = Object.keys(target1);
  const toArray2 = Object.keys(target2);
  console.log(target1, toArray1);
  if (toArray1.length !== toArray2.length) return false;

  for (let key of toArray1) {
    if (!toArray2.includes(key) || !deepEquals(target1[key], target2[key])) {
      return false;
    }
  }

  return true;
}

export function createNumber1(n) {
  // 출제의도: js는 객체에 산술 연산을 할때 valueOf 매서드나 toString 매서드를 호출하여 객체를 원시 값으로 변환한다.
  return new Number(n);
}

export function createNumber2(n) {
  // 출제의도: createNumber1와 동일.
  return new String(n);
}

export function createNumber3(n) {
  // 출제의도: 연산을 할때 자동 형 변환이 되는 것을 이해하기.
  // basic.test.js 210번째 줄의 typeof 연사자를 사용했을때, object가 반환되는 것을 보고 객체 형태를 유추.
  // 덧셈 연사자는 강제 형 변환 과정을 거침. Object에 대해서는 valueOf 함수가 적용됨.
  // JSON.stringify 는 인스턴스에 toJson형태로 사용이 가능하기 때문에 해당 함수를 만들어 JSON.stringify가 실행되면 원하는 값을 반환하도록 함.
  // basic.test.js 207줄의 JSON.stringify는 이미 덧셈 연사자로 강제 형 변환 과정을 거친 Object에 대해 JSON.stringify 함수가 실행되는 형태이기 때문에 "3"이 출력됨.
  class CreateNum3 {
    constructor(n) {
      this.value = n;
    }
    valueOf() {
      return this.value;
    }
    toString() {
      return this.value;
    }
    toJSON() {
      return `this is createNumber3 => ${this.value}`;
    }
    get() {
      return this.value;
    }
  }
  const createNum3 = new CreateNum3(n);
  return createNum3;
}
const cache = {};

export class CustomNumber {
  //출제의도: class를 생성하여 만들어낸 인스턴스 값 캐싱.
  constructor(n) {
    if (cache[n]) {
      return cache[n];
    }
    this.value = n;
    cache[n] = this;
  }

  valueOf() {
    return this.value;
  }

  toJSON() {
    return this.toString();
  }

  toString() {
    return this.value.toString();
  }

  get() {
    return this.value;
  }
}

export function createUnenumerableObject(target) {
  //출제의도: 객체의 속성을 정의해보는 defineProperty 사용해보기.
  const resultObj = {};

  for (let key in target) {
    Object.defineProperty(resultObj, key, {
      value: target[key],
      enumerable: false,
    });
  }

  return resultObj;
}

export function forEach(target, callback) {
  // target이 array, object, Nodelist중 어느 것인지 파악하여 해당하는 자료형에 맞는 for문을 돌려
  // callback function의 수행 동작을 수행한 값 들을 배열 또는 객체에 담아 반환 하도록 한다.
  // 출제의도: Object.getOwnPropertyNames() 메서드는 객체 자체의 모든 프로퍼티를 반환하며, enumerable 속성 여부와 관계없이 모든 프로퍼티를 포함하는 것을 알게 하기 위함.
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else if (target instanceof NodeList) {
    const toArray = Array.from(target);
    for (let j = 0; j < toArray.length; j++) {
      callback(toArray[j], j);
    }
  } else {
    const values = Object.getOwnPropertyNames(target);
    for (let k = 0; k < values.length; k++) {
      callback(target[values[k]], values[k]);
    }
  }
}

export function map(target, callback) {
  // 출제의도: 실제 react나 vanilla JS에서 iterable함수를 사용하였을때, 내부적으로 어떻게 인자들을 판단하는지 알아보게 하기 위함.
  const values = Object.getOwnPropertyNames(target);
  console.log(values);
  if (Array.isArray(target)) {
    let mappedTagert = [];

    for (let i = 0; i < target.length; i++) {
      mappedTagert.push(callback(target[i]));
    }
    return mappedTagert;
  } else if (target instanceof NodeList) {
    let mappednode = [];

    const toArray = Array.from(target);
    for (let j = 0; j < toArray.length; j++) {
      mappednode.push(callback(toArray[j]));
    }
    return mappednode;
  } else {
    let mappedObj = {};
    const values = Object.getOwnPropertyNames(target);
    for (let k = 0; k < values.length; k++) {
      mappedObj[values[k]] = callback(target[values[k]]);
    }
    return mappedObj;
  }
}

export function filter(target, callback) {
  const values = Object.getOwnPropertyNames(target);
  console.log(values);
  // 출제의도: map과 동일.
  if (Array.isArray(target)) {
    let filteredTagert = [];

    for (let i = 0; i < target.length; i++)
      callback(target[i]) ? filteredTagert.push(target[i]) : null;

    return filteredTagert;
  } else if (target instanceof NodeList) {
    let filterednode = [];
    const toArray = Array.from(target);

    for (let j = 0; j < toArray.length; j++)
      callback(toArray[j]) ? filterednode.push(target[j]) : null;

    return filterednode;
  } else {
    let filteredObj = {};
    const values = Object.getOwnPropertyNames(target);
    for (let k = 0; k < values.length; k++)
      callback(target[values[k]])
        ? (filteredObj[values[k]] = target[values[k]])
        : null;

    return filteredObj;
  }
}

export function every(target, callback) {
  // 출제의도: map과 동일.
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i])) {
        return false;
      }
    }
    return true;
  } else if (target instanceof NodeList) {
    const toArray = Array.from(target);
    for (let j = 0; j < toArray.length; j++) {
      if (!callback(toArray[j])) {
        return false;
      }
    }
    return true;
  } else {
    const values = Object.getOwnPropertyNames(target);
    for (let k = 0; k < values.length; k++) {
      if (!callback(target[values[k]])) {
        return false;
      }
    }
    return true;
  }
}

export function some(target, callback) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) {
        return true;
      }
    }
    return false;
  } else if (target instanceof NodeList) {
    const toArray = Array.from(target);
    for (let j = 0; j < toArray.length; j++) {
      if (callback(toArray[j])) {
        return true;
      }
    }
    return false;
  } else {
    const values = Object.getOwnPropertyNames(target);
    for (let k = 0; k < values.length; k++) {
      if (callback(target[values[k]])) {
        return true;
      }
    }
    return false;
  }
}
