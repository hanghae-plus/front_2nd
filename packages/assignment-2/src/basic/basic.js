// new 연산자로 number, string, boolean 생성했는지 여부
const isNewPrimitiveObj = (x) => {
  return x instanceof Number || x instanceof String || x instanceof Boolean
}

const isObjectTyp = (y) => {
  return typeof y === 'object'
}
// custom class 여부
// * 커스텀클래스의 프로토타입을 구해, 자바스크립트 내장 객체의 프로토타입과 비교한다.
// * 내장 객체라면 자바스크립트 기본 메서드들이 선언되어 있을것이고, 커스텀클래스라면 커스텀한 메서드들이 선언되어있을것이므로.
// * 프로토타입의 constructor에 접근해 class 는 타입이 함수이기때문에, 객체와 배열이 아닌 함수를 체크하여 return 해준다. 
const isCustomClass = (customClass) => {
  const customClassProto = Object.getPrototypeOf(customClass)
  const customClassConstructor = customClassProto.constructor
  if(customClassProto === Object.prototype || customClassProto === null) return false
  return typeof customClassConstructor === 'function' && customClassConstructor !== Object && customClassConstructor !== Array
}
// 중첩되었는지 체크(배열이나 객체가)
const isReturnNested = (value) => {
  let isNested = false
  for(const prop in value) {
    if(typeof value[prop] === 'object') {
      isNested = true
    }
  }
  return isNested
}


export function shallowEquals(target1, target2) {
  
  // new 연산자로 생성한 Number, String, Boolean type false로 리턴
  if(isNewPrimitiveObj(target1) && isNewPrimitiveObj(target2)) return false

  // 타입이 다르면 false 리턴
  if (typeof target1 !== typeof target2) return false;
  
  // 값이 같으면 true로 리턴
  if (target1 === target2) return true;
  
  if (isObjectTyp(target1) && isObjectTyp(target2)) {
    if(isCustomClass(target1) && isCustomClass(target2)) return false // 커스텀클래스형일때
    
    // 중첩된 객체 및 배열일 때
    if(isReturnNested(target1) || isReturnNested(target2) ) {
      return false
    } else { // 1depth정도일때는 stringify 하여 비교
      return JSON.stringify(target1) === JSON.stringify(target2)
    }
    
  }
  return false;
}

export function deepEquals(target1, target2) {

  // new 연산자로 생성한 Number, String, Boolean type false로 리턴
  if(isNewPrimitiveObj(target1) && isNewPrimitiveObj(target2)) return false

  // 타입이 다르면 false 리턴
  if (typeof target1 !== typeof target2) return false;
  
  // 값이 같으면 true로 리턴
  if (target1 === target2) return true;
  
  if (typeof target1 === 'object' && target1 !== null && target2 !== null) {
    if(isCustomClass(target1) && isCustomClass(target2)) return false // 커스텀클래스형일때
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!deepEquals(target1[key], target2[key])) return false; // 재귀호출하여 키값에따른 value값이 같은지 비교
    }
    return true;
  }
  return false;
}

export function createNumber1(n) {
  const obj = new Number(n)
  return obj;
}

export function createNumber2(n) {
  const obj = new String(n);
  return obj;
}

export function createNumber3(n) {
  return {
    value: new Number(n),
    valueOf() {
      return n;
    },
    toString() {
      return `${n}`;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`
    }
  };
}

export class CustomNumber {
  constructor(num) {
    if (CustomNumber.instances[num]) {
      return CustomNumber.instances[num];
    }
    this.num = num;
    CustomNumber.instances[num] = this;
  }

  // 객체가 숫자 컨텍스트에서 사용될 때 호출됨
  valueOf() {
    return this.num;
  }

  // 객ㅔ가 문열 컨텍스트에서 사용될 때  호출됨
  toString() {
    return `${this.num}`;
  }
  // JSON.stringify가 호출될 때 사용됨
  // json변환 시 커스터마이징 해서 리턴가능함.
  toJSON() {
    return this.num.toString()
  }

  static instances = {};
}

export function createUnenumerableObject(target) {
  const obj = {};
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      Object.defineProperty(obj, key, {
        value: target[key],
        enumerable: false, // Unenumerable 설정
        writable: true, // 속성값을 수정할 수 있도록 설정 (필요 시)
        configurable: true // 속성을 재정의할 수 있도록 설정 (필요 시)
      });
    }
  }
  return obj;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else if (typeof target === 'object' && target !== null) {
    const targetObj = Object.getOwnPropertyDescriptors(target) // 객체의 모든 설명자 반환
    for (let key in targetObj) {
      callback(targetObj[key].value, key);
    }
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }
    return result;
  } else if (typeof target === 'object' && target !== null) {
    const targetObj = Object.getOwnPropertyDescriptors(target) // 객체의 모든 설명자 반환
    const result = {};
    for (let key in targetObj) {
      result[key] = callback(targetObj[key].value, key);
    }
    return result;
  }
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        result.push(target[i]);
      }
    }
    return result;
  } else if (typeof target === 'object' && target !== null) {
    const targetObj = Object.getOwnPropertyDescriptors(target) // 객체의 모든 설명자 반환
    const result = {};
    for (let key in targetObj) {
      if (callback(targetObj[key].value, key)) {
        result[key] = targetObj[key].value;
      }
    }
    return result;
  }
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === 'object' && target !== null) {
    for (let key in target) {
      if (!callback(target[key], key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === 'object' && target !== null) {
    const targetObj = Object.getOwnPropertyDescriptors(target) // 객체의 모든 설명자 반환

    for (let key in targetObj) {
      if (callback(targetObj[key].value, key)) {
        return true;
      }
    }
    return false;
  }
  return false;
}
