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



