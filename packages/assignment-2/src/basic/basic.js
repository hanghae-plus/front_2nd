export function shallowEquals(target1, target2) {
  // refactor: 같은 객체인지 우선 비교
  if (target1 === target2) {
    return true;
  }

  const typeOf = (target) => {
    const targetType =
      target?.constructor.name ?? Object.prototype.toString.call(target);
    return targetType;
  };

  if (typeOf(target1) !== typeOf(target2)) {
    return false;
  }

  if (typeOf(target1) === "Array") {
    if (target1.length !== target2.length) {
      return false;
    }
    return target1.every((el, index) => el === target2[index]);
  } else if (typeOf(target1) === "Object") {
    return Object.keys(target1).every((key) => target1[key] === target2[key]);
  }

  return false;
}

export function deepEquals(target1, target2) {
  // shallowEquals와 유사하지만, 재귀적으로 내부 객체까지 비교
  if (target1 === target2) {
    return true;
  }
  if (
    Array.isArray(target1) &&
    Array.isArray(target2) &&
    target1.length === target2.length
  ) {
    return target1.every((v, k) => deepEquals(v, target2[k]));
  }
  if (target1?.constructor === Object && target2?.constructor === Object) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);
    return (
      target1 === target2 ||
      (key1.length === key2.length &&
        key1.every((key) => deepEquals(target1[key], target2[key])))
    );
  }
  return false;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  const createObject = Object.create(Object.prototype);

  createObject.valueOf = () => n;
  createObject.toJSON = () => `this is createNumber3 => ${n}`;
  createObject.toString = () => String(n);

  return createObject;
}

export class CustomNumber {
  static instanceMap = new Map();

  constructor(value) {
    if (CustomNumber.instanceMap.has(value)) {
      return CustomNumber.instanceMap.get(value);
    }

    this.value = value;
    CustomNumber.instanceMap.set(value, this);
  }

  valueOf() {
    return this.value;
  }

  toJSON() {
    return `${this.value}`;
  }

  toString() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  const result = {};

  Object.keys(target).forEach((key) => {
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false, // 열거 불가 ( for ..in 불가)
      // writable: false, // 읽기 전용 (value 값 변경 불가)
      // configurable: false, // 재정의 불가 (삭제/변경 불가) // writable이 true면 value 변경은 가능
    });
  });

  return result;
}

/**
 * property가 재정의된 새로운 객체를 리턴한다.
 * @param target
 * @returns {{}}
 */
function getNewObject(target) {
  const targetNames = Object.getOwnPropertyNames(target);
  const newObject = {};

  targetNames.forEach((key) => {
    newObject[key] = target[key];
  });

  return newObject;
}

export function forEach(target, callback) {
  const targetType = target?.constructor.name;

  switch (targetType) {
    case "Object":
      {
        const newObject = getNewObject(target);

        for (const [key, value] of Object.entries(newObject)) {
          callback(value, key);
        }
      }
      break;
    case "Array":
      {
        for (const [key, value] of target.entries()) {
          callback(value, key);
        }
      }
      break;
    case "NodeList":
      {
        for (const [key, value] of Object.entries(target)) {
          callback(value, parseInt(key));
        }
      }
      break;
  }
}

export function map(target, callback) {
  const targetType = target.constructor.name;
  const callbackArr = [];

  switch (targetType) {
    case "Object": {
      const newObject = getNewObject(target);

      for (const [key, value] of Object.entries(newObject)) {
        callbackArr.push({ [key]: callback(value) });
      }

      return callbackArr.reduce((acc, obj) => ({ ...acc, ...obj }), {});
    }
    case "Array": {
      for (const value of target.values()) {
        callbackArr.push(callback(value));
      }

      return callbackArr;
    }
    case "NodeList": {
      for (const value of Object.values(target)) {
        callbackArr.push(callback(value));
      }

      return callbackArr;
    }
  }
}

export function filter(target, callback) {
  const targetType = target.constructor.name;
  const callbackArr = [];

  switch (targetType) {
    case "Object": {
      const newObject = getNewObject(target);

      for (const [key, value] of Object.entries(newObject)) {
        if (callback.call(newObject, value)) {
          callbackArr.push({ [key]: value });
        }
      }

      return callbackArr.reduce((acc, obj) => ({ ...acc, ...obj }), {});
    }
    case "Array": {
      for (const value of target.values()) {
        if (callback.call(target, value)) {
          callbackArr.push(value);
        }
      }

      return callbackArr;
    }

    case "NodeList": {
      for (const value of Object.values(target)) {
        if (callback.call(target, value)) {
          callbackArr.push(value);
        }
      }

      return callbackArr;
    }
  }
}

export function every(target, callback) {
  const targetType = target.constructor.name;
  const callbackArr = [];

  switch (targetType) {
    case "Object": {
      const newObject = getNewObject(target);
      const newObjectEntries = Object.entries(newObject);

      for (const [key, value] of newObjectEntries) {
        if (callback.call(newObject, value)) {
          callbackArr.push({ [key]: value });
        }
      }

      return callbackArr.length === newObjectEntries.length;
    }
    case "Array": {
      for (const value of target.values()) {
        if (callback.call(target, value)) {
          callbackArr.push(value);
        }
      }

      return callbackArr.length === target.length;
    }

    case "NodeList": {
      const objectValues = Object.values(target);

      for (const value of objectValues) {
        if (callback.call(target, value)) {
          callbackArr.push(value);
        }
      }
      return callbackArr.length === objectValues.length;
    }
  }
}

export function some(target, callback) {
  const targetType = target.constructor.name;
  const callbackArr = [];

  switch (targetType) {
    case "Object":
      {
        const newObject = getNewObject(target);
        const newObjectEntries = Object.entries(newObject);

        for (const [key, value] of newObjectEntries) {
          if (callback.call(newObject, value)) {
            callbackArr.push({ [key]: value });
          }
        }
      }
      break;
    case "Array":
      {
        for (const value of target.values()) {
          if (callback.call(target, value)) {
            callbackArr.push(value);
          }
        }
      }
      break;
    case "NodeList":
      {
        const objectValues = Object.values(target);

        for (const value of objectValues) {
          if (callback.call(target, value)) {
            callbackArr.push(value);
          }
        }
      }
      break;
  }

  return callbackArr.length > 0;
}
