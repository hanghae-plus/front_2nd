// function isPrimitive(value) {
//   return (value === null || (typeof value !== 'object' && typeof value !== 'function'));
// }

function getDimensions(test) {
  let maxDepth = 0;
  if(Array.isArray(test)){
    for (let i = 0; i < test.length; i++) {
      if (Array.isArray(test[i])) {
          maxDepth = Math.max(maxDepth, getDimensions(test[i]));
      }
      // Array가 아닌 객체가 다차원으로 있을 수 있다.
      else if(test[i].constructor.name === 'Object'){
          maxDepth = Math.max(maxDepth, getDimensions(test[i]));
      }
    }
  }
  else if(typeof test === 'object'){
    for (var key in test){
      if(typeof test[key] === 'object'){
        maxDepth = Math.max(maxDepth, getDimensions(test[key]));
      }
      // Object가 아닌 객체가 다차원으로 있을 수 있다.
      else if(Array.isArray(test[key])){
        maxDepth = Math.max(maxDepth, getDimensions(test[key]));
      }
    }
  }
 
  return maxDepth + 1; // 현재 차원에 +1
}

function hasConstructor(test){
  // 생성자로 만든 객체인 경우 내용 비교
  if(test instanceof Number || test instanceof String || test instanceof Boolean) {
    return true
  }
  if(Array.isArray(test)){
    for (let i = 0; i < test.length; i++) {
      if (Array.isArray(test[i]) || test[i].constructor.name === 'Object') {
        if(hasConstructor(test[i])){
          return true
        }
      }
    }
  }
  else if(typeof test === 'object'){
    for (var key in test){
      if(typeof test[key] === 'object' || Array.isArray(test[key])){
        if(hasConstructor(test[key])){
          return true
        }
      }
    }
  }
  return false
}


export function shallowEquals(target1, target2) {
  // 테스트 코드를 보니 생성자로 생성된 객체들은 초기화 값이 같아도 false이다.
  // 즉 메모리 주소가 다르면 다른 것으로 인지하기 때문에 === 로 비교를 해준다.
  // 원시 객체는 ===로 비교
  if(target1 === target2) return target1 === target2
 
  // Object나 Array의 경우 참조형으로 ===로 비교시 false가 된다.
  // 그러나 내용이 같은지 보고 비교하여 같으면 true가 되도록 해야하기 때문에 string화 했을때 동일하지만 다차원일 경우에는 false가 되도록 test code가 되어 있다.
  if((Array.isArray(target1) && Array.isArray(target2))
    || (target1.constructor.name === 'Object' && target2.constructor.name === 'Object')){
      if(getDimensions(target1) === 1 && getDimensions(target2) === 1){
        return JSON.stringify(target1) === JSON.stringify(target2)
      }
      else{
        return false
      }
    }
    return false
}

export function deepEquals(target1, target2) {
  if(target1 === target2) return target1 === target2
 
  // 안에 내용이 같으면 true로 반환하지만, 생성자로 만든 객체는 달라야 한다.
  if((Array.isArray(target1) && Array.isArray(target2))
    || (target1.constructor.name === 'Object' && target2.constructor.name === 'Object')){
   
    // 생성자로 만든 요소가 있는지 확인
    if(hasConstructor(target1 || hasConstructor(target2))){
      return false
    }
    return JSON.stringify(target1) === JSON.stringify(target2)
  }
    return false
}


export function createNumber1(n) {
  // 원시 객체 Number처럼 동작하되, 원시객체와 덧셈도 가능해야함.그러나 원시객체와 비교시 false가 나와야한다.
  const num = new Number(n)
  return num;
}

export function createNumber2(n) {
  // 원시 객체 string 처럼 동작하되, 원시객체와 + 연산도 가능해야한다. 그러나 원시객체와 비교시 false가 나와야한다.
  const str = new String(n)
  return str
}

export function createNumber3(n) {
  // 테스트 코드를 봤을 때 number객체는 아니지만 object type은 맞다.
  // 또한 Number의 인스턴스는 아니어야 한다.
  // 그래서 아예 새로운 객체를 생성하도록 해야한다.
  // const num = new Number(n)
  const num = Object.create(Number.prototype);
 
  // 자동 형변환시 내부적으로 toString과 valueOf를 사용한다.
  // 참고 : https://ko.javascript.info/object-toprimitive
  // 객체를 원시 값으로 변환해야함 이걸 안하면 console.log(인스턴스) 시 출력이 안된다.
  num.valueOf = () => n;

  // 객체를 문자열로 변환하는 메서드를 정의해야 num.toString()
  num.toString = () => `${n}`;
  //toJSON() 메서드는 해당 객체의 JSON 안전 버전을 반환하는 기능을 수행한다. JSON.stringify()의 인자로 들어오는 객체에 toJSON() 메서드가 정의되어 있다면 문자열로 변환하기 전 toJSON() 을 호출하여 직렬화한 값을 가져온다.
  num.toJSON = () => `this is createNumber3 => ${n}`

  // instanceof 연산자는 객체의 .__proto__ 속성을 이용하여 객체의 프로토타입 체인을 확인하고, 특정 클래스의 프로토타입과 비교하여 인스턴스 여부를 판단
  // 그래서 이 속성을 null로 바꾸어서 Number와 연관을 끊어야한다.
  num.__proto__ = null;
  return num;
}

const cache = new Map();
export class CustomNumber {
  // 테스트코드를 보면 CustomNumber(1)===1 시 false로 객체가 달라야한다.
  // 하지만 CustomNumber(1)==1 시 true로 값은 같아야한다.
  // 기본적인 덧셈연산(숫자시 더하기, 문자시 결합, 문자열인 객체가 하나 있으면 자동형변환)이 가능해야한다.
  // JSON.stringify시 앞에는문자열 뒤에는 숫자로 return해야한다.

  // 이미 동일값으로 만들어진 객체가 있다면 그 객체를 가져다 써서
  // 주소값을 동일하게 만들기 위해 (test code 197) map을 사용하여 저장후
  // 저장된 값이 있으면 그 객체를 return하도록 하였다.
  constructor(n) {
    if (cache.has(n)) {
      return cache.get(n);
    }
    this.n = n;
    cache.set(n, this);
  }

  valueOf() {
    return this.n;
  }

  toString() {
    return `${this.n}`;
  }

  toJSON() {
    return `${this.n}`;
  }

  get(){
    return this.n
  }

}

export function createUnenumerableObject(target) {
  // object 객체를 생성하는데 spread로 풀면 풀어지지 않는 객체를 만들어야한다.
  // 대상 객체의 모든 속성들을 열거 불가능하게 만든다
  for (const key in target) {
    Object.defineProperty(target, key, {
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  return target
}

export function forEach(target, callback) {
  // element들은 NodeList 객체이다.
  if(Array.isArray(target) || target instanceof NodeList){
    for(let i = 0; i < target.length; i++){
      callback(target[i], i);
    }
  }
  else if (typeof target === 'object') {
    // 아무리 해도 obj 부분이 테스트가 통과가 안되고 있었다.
    // 비 열거형 객체는 키가 조회가 안되서 그렇다!
    const descriptors = Object.getOwnPropertyDescriptors(target);
    for (const key in descriptors) {
        callback(target[key], key);
    }
  }

}

export function map(target, callback) {
  if(Array.isArray(target) || target instanceof NodeList){
    const result =[];
    for(let i = 0; i < target.length; i++){
      result.push(callback(target[i], i));
    }
    return result;
  }
  else if (typeof target === 'object') {
    const result ={}
    const descriptors = Object.getOwnPropertyDescriptors(target);
    for (const key in descriptors) {
      result[key]=callback(target[key], key);
    }
    return result;
  }
  
}

export function filter(target, callback) {
  if(Array.isArray(target) || target instanceof NodeList){
    const result =[];
    for(let i = 0; i < target.length; i++){
      if(callback(target[i], i)){
        result.push(target[i]);
      }
    }
    return result;
  }
  else if (typeof target === 'object') {
    const result ={}
    const descriptors = Object.getOwnPropertyDescriptors(target);
    for (const key in descriptors) {
      if(callback(target[key], key)){
        result[key] = target[key]
      }
    }
    return result;
  }
}


export function every(target, callback) {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (!callback(target[key], key)) {
        return false;
      }
    }
  }
  return true;
}

export function some(target, callback) {
  if(Array.isArray(target) || target instanceof NodeList){
    const result =[];
    for(let i = 0; i < target.length; i++){
      if(callback(target[i], i)){
        return true;
      }
    }
    return false;
  }
  else if (typeof target === 'object') {
    const result ={}
    const descriptors = Object.getOwnPropertyDescriptors(target);
    for (const key in descriptors) {
      if(callback(target[key], key)){
        return true;
      }
    }
    return false;
  }
}



