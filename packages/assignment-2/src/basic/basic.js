export function shallowEquals(target1, target2) {
  // shallowEquals(얕은 비교)
  // 1. 원시 값을 비교할 때는 형변환이 발생함.
  // 2. 참조 값을 비교할 때는 1단계 깊이에서만 비교함.
  if (typeof target1 === "undefined") return target1 == target2;

  if (typeof target1 === "object") {
    return target1 == target2;
  }

  if (target1.valueOf() === target2.valueOf()) true;
  if (target1.toString() === target2.toString()) true;

  // typeof를 사용하여 target1과 target2 의 형 비교하기.
  // type이 object가 아니라면 모든 일치 연산자로 비교한 값을 리턴 한다.(array도 object에 포함되기 때문에 모든 Primitive Type을 걸러낼 수 있다.)

  for (const t in target1) {
    if (target1[t] !== target2[t]) return false;
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length === 0 && keys2.length === 0) {
    return true;
  }

  return target1 == target2;
  // 동등 연산자 == 는 0 과 false를 구별하지 못한다.
  // 동등 연산자는 형이 다른 피연산자를 비교할 때, 피연산자를 숫자형으로 바꾸기 때문에 이다 (a == b a == Number(b));
  // 일치 연산자 === 는 자료 형 까지 구분하여 검사한다.
  // 문제의 의도: target1 과 target2가 서로 다른 값을 참조하더라도 속성 혹은 요소의 값들이 같다면 true를 반환하는 함수를 만드는 것이 목표.
}

// Static method는 클래스 레벨에서 동작하고, prototype method는 인스턴스 레벨에서 동작함.

export function deepEquals(target1, target2) {
  return target1 === target2;
}

export function createNumber1(n) {
  // js는 객체에 산술 연산을 할때 valueOf 매서드나 toString 매서드를 호출하여 객체를 원시 값으로 변환한다.
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  Object.defineProperty(JSON, "stringify", {
    value: function (n, m) {
      if (n && m) {
        return n + m;
      } else return `"this is createNumber3 => ${n}"`;
    },
  });
  return new Number(n);
}

export class CustomNumber {}

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
