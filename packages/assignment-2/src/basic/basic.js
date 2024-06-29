export function shallowEquals(target1, target2) {
  function checkValue(target1, target2) {
    return function innerFunction(v, idx, arr) {
      return arr[idx] === target2[idx];
    };
  }

  function shallowEqual(object1, object2) {
    if (object1.constructor !== object2.constructor) {
      return false;
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  if (typeof target1 !== typeof target2) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) {
      return false;
    }
    //console.log("[배열 비교]");
    return target1.every(checkValue(target1, target2));
  }

  if (
    Object.prototype.toString.call(target1) === "[object Object]" &&
    Object.prototype.toString.call(target2) === "[object Object]"
  ) {
    //console.log("[객체 비교]");
    return shallowEqual(target1, target2);
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  let targetList = [];
  function checkObjValue(t1, t2) {
    if (
      (t1?.constructor !== t2?.constructor &&
        Object.prototype.toString.call(t1) !== "[object Array]") ||
      Object.prototype.toString.call(t1) === "[object Undefined]" ||
      Object.prototype.toString.call(t1) === "[object Null]" ||
      Object.prototype.toString.call(t1) === "[object Number]" ||
      Object.prototype.toString.call(t1) === "[object String]"
    )
      targetList.push(shallowEquals(t1, t2));
    if (t1?.length !== t2?.length) {
      targetList.push(false);
    }
    if (typeof t1 === "object") {
      for (const key in t1) {
        if (Object.keys(t1[key]).length) {
          checkObjValue(t1[key], t2[key]);
        } else {
          targetList.push(shallowEquals(t1[key], t2[key]));
        }
      }
    }
  }
  checkObjValue(target1, target2);
  return targetList.every((v) => v);
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  let value = n;
  return {
    valueOf() {
      return value;
    },
    toJSON() {
      return `this is createNumber3 => ${value}`;
    },
    toString() {
      return `${value}`;
    },
  };
}

export class CustomNumber {
  #value;
  static instances = new Map();
  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }
    this.#value = value;
    CustomNumber.instances.set(value, this);
  }
  valueOf() {
    return this.#value;
  }
  toJSON() {
    return `${this.#value}`;
  }
  toString() {
    return `${this.#value}`;
  }
}

export function createUnenumerableObject(target) {
  for (const key of Object.keys(target)) {
    Object.defineProperty(target, key, {
      enumerable: false, // 객체의 키를 열거 가능 여부
      configurable: false, // 객체에서 해당 속성의 삭제 가능 여부
      writable: false, // 외부에서 객체값 변경 가능 여부
      value: target[key],
      // get() {
      //   return target[key];
      // },
      // set(x) {
      //   target[key] = x;
      // },
    });
  }
  return target;
}

function isNodeList(nodes) {
  var stringRepr = Object.prototype.toString.call(nodes);

  return (
    typeof nodes === "object" &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    typeof nodes.length === "number" &&
    (nodes.length === 0 ||
      (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
  );
}

export function forEach(target, callback) {
  if (Array.isArray(target) || isNodeList(target)) {
    let targetObj = Object.entries(target);
    for (const [key, value] of targetObj) {
      callback(value, parseInt(key));
    }
  } else if (typeof target === "object" && !isNodeList(target)) {
    let targetObj = Object.getOwnPropertyDescriptors(target);
    for (const key in targetObj) {
      callback(targetObj[key].value, key);
    }
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || isNodeList(target)) {
    let result = [];
    for (const key of target) {
      result.push(callback(key));
    }
    return result;
  } else if (typeof target === "object" && !isNodeList(target)) {
    let result = {};
    let targetObj = Object.getOwnPropertyDescriptors(target);

    for (const key in targetObj) {
      result = { ...result, [key]: callback(targetObj[key].value) };
    }
    return result;
  }
}

export function filter(target, callback) {
  if (Array.isArray(target) || isNodeList(target)) {
    let result = [];
    for (const key of target) {
      if (callback(key)) {
        result.push(key);
      }
    }
    return result;
  } else if (typeof target === "object" && !isNodeList(target)) {
    let result = {};
    let targetObj = Object.getOwnPropertyDescriptors(target);
    for (const key in targetObj) {
      if (callback(targetObj[key].value)) {
        result = { ...result, [key]: targetObj[key].value };
      }
    }
    return result;
  }
}

export function every(target, callback) {
  if (Array.isArray(target) || isNodeList(target)) {
    for (const key of target) {
      if (!callback(key)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === "object" && !isNodeList(target)) {
    let targetObj = Object.getOwnPropertyDescriptors(target);
    for (const key in targetObj) {
      if (!callback(targetObj[key].value)) {
        return false;
      }
    }
    return true;
  }
}

export function some(target, callback) {
  if (Array.isArray(target) || isNodeList(target)) {
    for (const key of target) {
      if (callback(key)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === "object" && !isNodeList(target)) {
    let targetObj = Object.getOwnPropertyDescriptors(target);
    for (const key in targetObj) {
      if (callback(targetObj[key].value)) {
        return true;
      }
    }
    return false;
  }
}
