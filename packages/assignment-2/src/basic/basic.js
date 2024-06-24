// 생성자가 class로 시작하는 지 확인하여 클래스 인스턴스를 object와 구분하기 위함
function isClassInstance(target) {
  if (typeof target !== "object" || target === null) {
    return false;
  }

  let proto = Object.getPrototypeOf(target);

  while (proto) {
    const constructor = proto.constructor;

    if (constructor && typeof constructor === "function") {
      const constructorString = constructor.toString();
      if (/^class/.test(constructorString)) {
        return true;
      }
    }

    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

export function shallowEquals(target1, target2) {
  // 클래스 인스턴스의 경우 typeof, instanceof로 구분할 수 없어 별도 확인 필요
  if (isClassInstance(target1) || isClassInstance(target2)) {
    return target1 === target2;
  }
  if (
    Object.prototype.toString.call(target1).split(" ")[1].includes("Object") ||
    Object.prototype.toString.call(target1).split(" ")[1].includes("Array")
  ) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let i = 0; i < keys1.length; i++) {
      const currentKey = keys1[i];
      if (target1[currentKey] !== target2[currentKey]) {
        return false;
      }
    }

    return true;
  }
  return target1 === target2;
}

export function deepEquals(target1, target2) {
  return target1 === target2;
}


export function createNumber1(n) {
  return n;
}

export function createNumber2(n) {
  return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {

}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {

}

export function map(target, callback) {

}

export function filter(target, callback) {

}


export function every(target, callback) {

}

export function some(target, callback) {

}



