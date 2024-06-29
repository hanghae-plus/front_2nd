export function shallowEquals(target1, target2) {
  // 원시타입 모두 '동일'
  if (target1 === target2) {
    return true;
  }

  // 만약 하나라도 객체가 아니라면 fasle 처리
  if (typeof target1 !== "object" || typeof target2 !== "object") {
    return false;
  }

  // 둘 중 하나라도 Number와 String 인스턴스일 경우 false
  if (
    target1 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof Number ||
    target2 instanceof String
  ) {
    return false;
  }

  // 서로 다른 생성자의 인스턴스인 경우 false 반환
  if (target1.constructor !== target2.constructor) {
    return false;
  }
  

  // 객체의 키값 배열로 저장
  const target1_keys = Object.keys(target1);
  const target2_keys = Object.keys(target2);


  if (target1_keys.length !== target2_keys.length) {
    return false;
  }

  for (const key of target1_keys) {
    if (
      !Object.prototype.hasOwnProperty.call(target2, key) ||
      target1[key] !== target2[key]
    ) {
      return false;
    }
  }
  return true;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) return true;

  if (
    target1 instanceof Number ||
    target2 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof String
  )
    return false;

  if (target1.constructor !== target2.constructor) return false;

  // 두 객체가 같은 값을 지니는지 확인
  const target1_json = JSON.stringify(target1);
  const target2_json = JSON.stringify(target2);

  if (target1_json !== target2_json) return false;

  // key값으로 배열을 만들어서 비교
  const target1_keys = Object.keys(target1);
  const target2_keys = Object.keys(target2);

  
  const results = target1_keys.map(key => {
  if (!target2_keys.includes(key) || !deepEquals(target1[key], target2[key])) {
    return false;
  }
  return true;
});

// 결과 배열에서 false가 하나라도 있으면 전체 결과는 false
  const isEqual = !results.includes(false);

  return isEqual;
}


export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
    [Symbol.toPrimitive](value) {
      if (value === "number") return Number(n);
      if (value === "string") return String(n);
      return n;
    },
  };
}

// 값을 캐싱하기 위한 Map 객체 생성
const cache = new Map();

export class CustomNumber {
  constructor(value) {
    // 값이 캐시에 존재하면 캐시된 인스턴스를 반환
    if (cache.has(value)) {
      return cache.get(value);
    }

    this.value = value;

    // cache 저장
    cache.set(value, this);
  }

  // valueOf (number) 이면 number로
  valueOf() {
    return Number(this.value);
  }

  // 문자열로 변환될 때 string으로
  toString() {
    return String(this.value);
  }

  // JSON에서 string 처리
  toJSON() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  const result = {};

  for (const key in target) {
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
  return result;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 노드리스트의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target) {
        callback(target[i], i, target);
      }
    }
  } else if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      callback(target[key], key, target);
    }
  } 
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 노드리스트의 경우
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (i in target) {
        result.push(callback(target[i], i, target));
      }
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      result[key] = callback(target[key], key, target);
    }
    return result;
  } 
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 노드리스트의 경우
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (i in target && callback(target[i], i, target)) {
        result.push(target[i]);
      }
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        result[key] = target[key];
      }
    }
    return result;
  } 
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 노드리스트의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target && !callback(target[i], i, target)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (!callback(target[key], key, target)) {
        return false;
      }
    }
    return true;
  } 
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 노드리스트의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target && callback(target[i], i, target)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        return true;
      }
    }
    return false;
  } 
}

