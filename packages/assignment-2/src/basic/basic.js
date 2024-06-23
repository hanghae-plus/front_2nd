const checkArray = (target1, target2, func) => {
  if (target1.length !== target2.length) {
    return false;
  }

  for (let i = 0; i < target1.length; i++) {
    if (func ? !func(target1[i], target2[i]) : target1[i] !== target2[i]) {
      return false;
    }
  }

  return true;
}

const checkObject = (target1, target2, func) => {
  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (func ? !func(target1[key], target2[key]) : target1[key] !== target2[key]) {
      return false;
    }
  }

  return true;
}


// [ 얕은 비교 ]
export function shallowEquals(target1, target2) {
  if (target1 === target2) return true;   // 두 값이 동일한 경우 true 반환
  if (Array.isArray(target1) && Array.isArray(target2))  return checkArray(target1, target2); // 배열 비교
  if ( target1.constructor === Object &&  target2.constructor === Object) return checkObject(target1, target2);  // 객체 비교

  return false;
}

// [ 깊은 비교 ]
export function deepEquals(target1, target2) {
  if (target1 === target2) return true;  // 두 값이 동일한 경우 true 반환
  if (Array.isArray(target1) && Array.isArray(target2))  return checkArray(target1, target2, deepEquals); // 배열 재귀적 비교
  if ( target1.constructor === Object &&  target2.constructor === Object) return checkObject(target1, target2, deepEquals);  // 객체 재귀적 비교


  return false;
}

/*
*  [ valueOf ]
* - valueOf() 메서드는 특정 객체의 정의된 원시 값을 반환합니다.
* - valueOf() 으로 반환된 원시값은 객체로 인식
* */
export function createNumber1(n) {
  return {
    valueOf() {
      return n;
    }
  };
}

export function createNumber2(n) {
  return {
    valueOf() {
      return String(n);
    }
  };
}

/*
*  [ toString ]
* - 객체의 원시데이터를 string으로 변환하려고 할때 동작하는 매서드
*
*   [toJSON ]
* - 객체의 원시데이터를 Json으로 변환하려고 할때 동작하는 메서드
* */
export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toString() {
      return `${n}`;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    }
  };
}

/*
* [ Class로 관리하는 숫자 ]
* - Map을 통해 정적프로퍼티를 정의하고 CustomNumber클래스로 받아오는 모든 값을 저장할수있는 자료구조를 만든다.
* */
export class CustomNumber {
  static instances = new Map();

  constructor(n) {
    // 기존값과 동일한 값이 들어왔을때 기존값 반환
    if (CustomNumber.instances.has(n)) return CustomNumber.instances.get(n);

    // 기존값과 틀린 값이 들어왔을때 instances Map에 저장
    this.num = n;
    CustomNumber.instances.set(n, this);
  }

  valueOf() {
    return this.num;
  }

  toString() {
    return `${this.num}`;
  }

  toJSON() {
    return `${this.num}`;
  }
}

/*
* - defineProperty: Object내부의 값들에 대한 설정
* - enumerable 은 각 속성을 열거할수있는지의 여부
* */
export function createUnenumerableObject(target) {
  const targetKeys =  Object.keys(target)

  targetKeys.forEach(key => {
    Object.defineProperty(target, key, {
      enumerable: false,
    });
  });
  return target;
}

export  function forEach(target, callback) {
  // Dom 처리
  if(target instanceof NodeList){
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  }
  // 배열 처리
  else if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  }
  // 객체 처리
  else if (typeof target === 'object' && target !== null) {
    const targetKeys = Object.getOwnPropertyNames(target); // getOwnPropertyNames는 enumerable: false로 비활성화된 key값도 조회
    for (let key of targetKeys) {
      callback(target[key], key);
    }
  }
}

export function map(target, callback) {
  // Dom 처리
  if(target instanceof NodeList){
    let arr = []
    for (let i = 0; i < target.length; i++) {
      arr.push(callback(target[i]));
    }

    return  arr
  }
  // 배열 처리
  else if (Array.isArray(target)) {
    let arr = []
    for (let i = 0; i < target.length; i++) {
      arr.push(callback(target[i]));
    }

    return  arr
  }
  // 객체 처리
  else if (typeof target === 'object' && target !== null) {
    let obj = {}
    const targetKeys = Object.getOwnPropertyNames(target); // getOwnPropertyNames는 enumerable: false로 비활성화된 key값도 조회
    for (let key of targetKeys) {
      obj[key] = callback(target[key]);
    }

    return obj
  }
}

export function filter(target, callback) {
  // Dom 처리
  if(target instanceof NodeList){
    let arr = []
    for (let i = 0; i < target.length; i++) {
      if(callback(target[i])) arr.push(target[i]);
    }

    return  arr
  }
  // 배열 처리
  else if (Array.isArray(target)) {
    let arr = []
    for (let i = 0; i < target.length; i++) {
      if(callback(target[i])) arr.push(target[i]);
    }

    return  arr
  }
  // 객체 처리
  else if (typeof target === 'object' && target !== null) {
    let obj = {}
    const targetKeys = Object.getOwnPropertyNames(target); // getOwnPropertyNames는 enumerable: false로 비활성화된 key값도 조회
    for (let key of targetKeys) {
      if(callback(target[key])) obj[key] = target[key];
    }

    return obj
  }
}


export function every(target, callback) {
  // Dom 처리
  if(target instanceof NodeList){
    let bol = true
    for (let i = 0; i < target.length; i++) {
      if(!callback(target[i])) bol = false;
    }

    return  bol
  }
  // 배열 처리
  else if (Array.isArray(target)) {
    let bol = true
    for (let i = 0; i < target.length; i++) {
      if(!callback(target[i])) bol = false;
    }

    return  bol
  }
  // 객체 처리
  else if (typeof target === 'object' && target !== null) {
    let bol = true
    const targetKeys = Object.getOwnPropertyNames(target); // getOwnPropertyNames는 enumerable: false로 비활성화된 key값도 조회
    for (let key of targetKeys) {
      if(!callback(target[key])) bol = false;
    }

    return  bol
  }
}

export function some(target, callback) {
  // Dom 처리
  if(target instanceof NodeList){
    let bol = false
    for (let i = 0; i < target.length; i++) {
      if(!callback(target[i])) bol = true;
    }

    return  bol
  }
  // 배열 처리
  else if (Array.isArray(target)) {
    let bol = false
    for (let i = 0; i < target.length; i++) {
      if(!callback(target[i])) bol = true;
    }

    return  bol
  }
  // 객체 처리
  else if (typeof target === 'object' && target !== null) {
    let bol = false
    const targetKeys = Object.getOwnPropertyNames(target); // getOwnPropertyNames는 enumerable: false로 비활성화된 key값도 조회
    for (let key of targetKeys) {
      if(!callback(target[key])) bol = true;
    }

    return  bol
  }
}



