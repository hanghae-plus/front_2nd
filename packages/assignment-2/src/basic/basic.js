// 이 문제는 얕게 비교할 수 있는 함수를 제작하는 것입니다.
// 객체 혹은 배열에서 1차로 돌렸을때 값이 동일하다면 성립합니다.
// 다만 예외로 new로 제작된 객체는 항상 다른 것으로 인식합니다.
// 그 외에는 같지 않습니다.
export function shallowEquals(target1, target2) {
  // 원시값 비교
  if (target1 === target2) {
    return true;
  }

  // 배열 비교
  const isArray1 = Array.isArray(target1);
  const isArray2 = Array.isArray(target2);

  if (isArray1 && isArray2) {
    if (target1.length !== target2.length) {
      return false;
    }

    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) {
        return false;
      }
    }
    return true;
  }

  // 객체 비교
  // new 생성자, 객체로 구분 비교
  const isObject1 = typeof target1 === "object";
  const isObject2 = typeof target2 === "object";

  if (isObject1 && isObject2) {
    // new 생성자 비교
    // 일반 객체 리터럴은 constructor 속성이 Object.prototype.constructor를 가리킴
    // new로 생성된 객체는 해당 생성자 함수의 prototype.constructor를 가리킴
    const isCreateWithNew1 = target1.constructor !== Object;
    const isCreatedWithNew2 = target2.constructor !== Object;

    if (isCreateWithNew1 || isCreatedWithNew2) {
      return false;
    }

    // 객체 비교
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (target1[key] !== target2[key]) {
        return false;
      }
    }

    return true;
  }

  return false;
}

// 이 문제는 깊게 비교할 수 있는 함수를 제작하는 것입니다.
// 객체 혹은 배열에서 인간의 시각으로 형태가 동일하다면 성립합니다.
// 다만 예외로 new로 제작된 객체는 항상 다른 것으로 인식합니다.
// 그 외에는 같지 않습니다.

// 내부를 재귀로 비교 합니다.
export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  const isArray1 = Array.isArray(target1);
  const isArray2 = Array.isArray(target2);

  if (isArray1 && isArray2) {
    if (target1.length !== target2.length) {
      return false;
    }

    for (let i = 0; i < target1.length; i++) {
      if (!deepEquals(target1[i], target2[i])) {
        return false;
      }
    }
    return true;
  }

  const isObject1 = typeof target1 === "object";
  const isObject2 = typeof target2 === "object";

  if (isObject1 && isObject2) {
    const isCreatedWithNew1 = target1.constructor !== Object;
    const isCreatedWithNew2 = target2.constructor !== Object;

    if (isCreatedWithNew1 || isCreatedWithNew2) {
      return false;
    }

    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!deepEquals(target1[key], target2[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

// 객체의 메서드 오버라이딩 (Overriding)
// 객체에는 기본적으로 정의된 메서드가 있지만, 이를 사용자 정의 메서드로 오버라이딩할 수 있습니다.
// 이를 통해 객체가 특정 상황에서 다르게 동작하도록 할 수 있습니다.
export function createNumber3(n) {
  return {
    value: n,
    // 객체가 원시 값으로 변환될 때 호출
    // 숫자 연산이나 비교 연산에서 사용
    // valueOf을 사용하면 === false, == true
    valueOf: function () {
      return this.value;
    },
    // 객체가 문자열로 변환될 때 호출
    toString: function () {
      return new String(this.value);
    },
    // JSON.stringify가 호출될 때 호출
    toJSON: function () {
      return `this is createNumber3 => ${this.value}`;
    },
  };
}

export class CustomNumber {
  // expect(num1).toBe(num3)
  // Singleton 패턴
  // 주어진 값에 대해 항상 동일한 인스턴스 반환 보장
  // CustomNumber 클래스의 인스턴스들이 주어진 값에 대한 동일성 유지 가능
  static instances = new Map();
  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }

    this.value = value;
    CustomNumber.instances.set(value, this);

    return this;
  }

  valueOf() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  toJSON() {
    return String(this.value);
  }
}

// 비열거형 속성을 만드는 이유
// 속성 숨기기: 속성을 숨겨서 외부 코드에서 실수로 접근하거나 변경 불가 처리
// 정의된 인터페이스 유지: 객체의 "공개" 속성과 "비공개" 속성을 구분
// 의도하지 않은 열거 방지: 특정 속성이 for...in 루프 등에 의해 의도하지 않게 열거되는 것을 방지
export function createUnenumerableObject(target) {
  const targetKeys = Object.keys(target);

  targetKeys.forEach((value) => {
    Object.defineProperty(target, value, {
      value: target[value],
      enumerable: false, // 비열거형 속성으로 설정
      writable: true,
      configurable: true,
    });
  });

  return target;
}

export function forEach(target, callback) {
  // 배열
  // 각 요소에 대해 콜백함수 실행
  // 인자는 (value, index)
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }

    return result;
  }

  // 객체
  // 각 속성에 대해 콜백함수 실행
  // 인자는 (value, key)

  // Object.keys() : 열거 가능한 속성만 가져옴
  // Object.getOwnPropertyNames() : 열거가능, 불가능 모두 가져옴
  // https://velog.io/@nemo/Object.keys-Object.getOwnPropertyNames
  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    callback(target[propertyArray[i]], propertyArray[i]);
  }
}

export function map(target, callback) {
  // 배열
  // 각 요소에 callback 함수를 실행한 값 적용 후 새로운 값을 적용한 배열 반환
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }

    return result;
  }

  // 객체
  // 각 속성에 callback 함수를 실행한 값 적용 후 새로운 값을 적용한 객체 반환
  // foreach와 다르게 반환 값 필요
  const propertyArray = Object.getOwnPropertyNames(target);

  const resultObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    resultObject[propertyArray[i]] = callback(target[propertyArray[i]]);
  }

  return resultObject;
}

export function filter(target, callback) {
  // 배열
  // 각 요소에 callback 함수를 실행한 값 적용 후 true 값만 반환
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (value) {
        result.push(target[i]);
      }
    }

    return result;
  }

  // 객체
  // 각 속성에 callback 함수를 실행한 값 적용 후  true 값만 반환
  const propertyArray = Object.getOwnPropertyNames(target);

  const resultObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    const result = callback(target[propertyArray[i]]);
    if (result) {
      resultObject[propertyArray[i]] = target[propertyArray[i]];
    }
  }

  return resultObject;
}

export function every(target, callback) {
  // 배열
  // 각 요소에 callback 함수를 실행한 값 적용 후 모두 true면 true
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (!value) {
        return false;
      }
    }

    return true;
  }

  // 객체
  // 각 속성에 callback 함수를 실행한 값 적용 후 모두 true면 true
  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    const value = callback(target[propertyArray[i]]);
    if (!value) {
      return false;
    }
  }

  return true;
}

export function some(target, callback) {
  // 배열
  // 각 요소에 callback 함수를 실행한 값 적용 후 하나라도 true면 true
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (value) {
        return true;
      }
    }

    return false;
  }

  // 객체
  // 각 속성에 callback 함수를 실행한 값 적용 후 하나라도 true면 true
  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    const value = callback(target[propertyArray[i]]);
    if (value) {
      return true;
    }
  }

  return false;
}
