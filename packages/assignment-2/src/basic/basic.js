export function shallowEquals(target1, target2) {
  // 원시 타입이나 함수의 경우 엄격한 동등 비교
  // 입력된 두 값이 객체가 아니거나 null인 경우를 체크 (Object.is()로 비교)
  if (
    typeof target1 !== "object" ||
    typeof target2 !== "object" ||
    target1 === null ||
    target2 === null
  ) {
    return Object.is(target1, target2);
  }

  // 참조가 같은 경우 (동일한 객체인 경우)
  if (target1 === target2) {
    return true;
  }

  // 생성자가 다른 경우
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  // 두 값이 배열인 경우, 길이를 비교, 각 요소를 순회하며 엄격 비교
  if (Array.isArray(target1)) {
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

  // 두 값이 일반 객체(Object)인 경우, 먼저 키의 개수를 비교
  // 그리고 각 키에 대해 순회하며 엄격 비교
  if (target1.constructor === Object) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (
        !Object.prototype.hasOwnProperty.call(target2, key) ||
        target1[key] !== target2[key]
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function deepEquals(target1, target2) {
  // 기본 비교
  if (target1 === target2) return true;

  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return false;

  // 타입 체크
  if (typeof target1 !== typeof target2) return false;

  // 객체 또는 배열인 경우
  if (typeof target1 === "object") {
    // new Number(), new String(), new 커스텀 클래스 등의 경우
    if (target1.constructor !== Object && target1.constructor !== Array) {
      return false;
    }

    // 배열인 경우
    // 키의 개수를 비교하고 각 키에 대해 재귀적으로 비교
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEquals(target1[key], target2[key])) return false;
    }

    return true;
  }

  // 기본 타입(문자열, 숫자 등)의 경우
  return false;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

// 사용자 정의 객체
export function createNumber3(n) {
  return {
    // 원래 숫자 값 반환
    valueOf() {
      return n;
    },
    // 문자열로 변환
    toString() {
      return String(n);
    },
    // JSON.stringify() 호출 시 반환값
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
  };
}

// 싱글톤 패턴 - 같은 숫자에 대해 항상 같은 인스턴스를 반환
export class CustomNumber {
  // 생성자를 호출할 때마다 인스턴스를 저장하는 맵
  // 키는 숫자, 값은 CustomNumber 인스턴스
  // 이미 생성된 숫자에 대해선 동일한 인스턴스를 반환
  static instanceMap = new Map();
  constructor(n) {
    if (CustomNumber.instanceMap.has(n)) {
      return CustomNumber.instanceMap.get(n);
    }
    this.n = n;
    CustomNumber.instanceMap.set(n, this);
  }

  valueOf() {
    return this.n;
  }

  toString() {
    return String(this.n);
  }

  toJSON() {
    return `${this.n}`;
  }
}

export function createUnenumerableObject(target) {
  // 깊은 복사
  const obj = structuredClone(target);

  // 열거할 수 없는 속성으로 설정
  for (let key in obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.defineProperty(obj, key, {
      ...descriptor,
      enumerable: false,
    });
  }

  return obj;
}

// 모든 프로퍼티를 순회하며, 콜백함수에 키와 값을 전달
export function forEach(target, callback) {
  // 열거 불가능한 속성도 포함하여 객체 자신의 모든 속성 이름을 반환
  const keys = Object.getOwnPropertyNames(target);
  keys.forEach((key) => {
    if (key === "length") return;
    callback(
      Number.isInteger(+target[key]) ? +target[key] : target[key],
      Number.isInteger(+key) ? +key : key
    );
  });
}

export function map(target, callback) {
  const keys = Object.getOwnPropertyNames(target);
  const result = [];
  keys.forEach((key) => {
    if (key === "length") return;
    // 콜백함수의 반환값을 result 배열에 push
    result.push(
      callback(Number.isInteger(+target[key]) ? +target[key] : target[key])
    );
  });

  // 배열 또는 NodeList인 경우 그대로 반환
  if (Array.isArray(target) || target instanceof NodeList) return result;

  return keys.reduce((acc, cur, index) => {
    return {
      ...acc,
      [cur]: result[index],
    };
  }, {});
}

export function filter(target, callback) {
  // 배열 또는 NodeList인 경우 빈 배열로 초기화, 그렇지 않은 경우 빈 객체로 초기화
  const result = Array.isArray(target) || target instanceof NodeList ? [] : {};

  forEach(target, (value, key) => {
    if (callback(value, key)) {
      // 결과 배열에 push
      if (Array.isArray(target) || target instanceof NodeList) {
        result.push(value);
      } else {
        // 결과 객체에 키, 값 추가
        result[key] = value;
      }
    }
  });

  return result;
}

export function every(target, callback) {
  let result = true;

  // 모든 요소가 조건을 만족해야 true
  forEach(target, (value, key) => {
    if (!callback(value, key)) {
      result = false;
    }
  });

  return result;
}

export function some(target, callback) {
  let result = false;

  // 하나라도 조건을 만족하면 true
  forEach(target, (value, key) => {
    if (callback(value, key)) {
      result = true;
    }
  });

  return result;
}
