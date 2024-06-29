export function shallowEquals(target1, target2) { 
 
  if (target1 === null && target2 === null) return target1 === target2 
  if (typeof target1 === 'object' && typeof target2 === 'object'){ 
    if (typeof target1.valueOf() === 'number' && typeof target2.valueOf() === 'number') return target1 === target2 
    // else if (Object.keys(target1).length > 0 && typeof Object.keys(target2).length > 0) return target1 === target2
    else if (typeof target1.valueOf() === 'string' && typeof target2.valueOf() === 'string') return target1 === target2
    else {  
      // isArray
      if (Array.isArray(target1) && Array.isArray(target2)) {
        if (target1.length !== target2.length) return false;
        for (let i = 0; i < target1.length; i++) {
          if (target1[i] !== target2[i]) return false;
        }
        return true;
      } 
      else { // not Array 
        const keys1 = Object.keys(target1);
        const keys2 = Object.keys(target2);
        if (keys1.length !== keys2.length) return false;
        for (const key of keys1) {
          if (!keys2.includes(key) || target1[key] !== target2[key]) {
            return false;
          }
        }
         
        return Object.getPrototypeOf(target1) === Object.getPrototypeOf(target2)        
      }
    } 
    
  }
  return target1 === target2
}



export function deepEquals(target1, target2) {
  if (target1 === target2) {
      return true;
  }
 
  if (typeof target1 !== typeof target2 || target1 == null || target2 == null) {
      return false;
  }

  // Number, String 
  if (typeof target1.valueOf() === 'number' && typeof target2.valueOf() === 'number') return target1 === target2 
  else if (typeof target1.valueOf() === 'string' && typeof target2.valueOf() === 'string') return target1 === target2

  // Array
  if (Array.isArray(target1) && Array.isArray(target2)) {
      if (target1.length !== target2.length) return false;
      for (let i = 0; i < target1.length; i++) {
          if (!deepEquals(target1[i], target2[i])) {
              return false;
          }
      }
      return true;
  }

  // 객체 
  if (typeof target1 === 'object' && typeof target2 === 'object') {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) return false;
      for (const key of keys1) {
          if (!keys2.includes(key) || !deepEquals(target1[key], target2[key])) {
              return false;
          }
      }
      return Object.getPrototypeOf(target1) === Object.getPrototypeOf(target2)        

  } 
 
  return false;
}



export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  const numString = String(n);
  return {
    valueOf() {
      return numString;
    },
    toString() {
      return numString;
    }
  };
}


export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toString() {
      return n.toString();
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    }
  };
}

 
export class CustomNumber {
  constructor(n) {
    if (CustomNumber.instances[n]) {
      return CustomNumber.instances[n];
    }
    this.num = n;
    CustomNumber.instances[n] = this;
  }

  valueOf() {
    return this.num;
  }

  toString() {
    return String(this.num);
  }

  toJSON() {
    return String(this.num);
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.num;
    }
    if (hint === 'string') {
      return this.toString();
    }
    return this.num;
  }
}

CustomNumber.instances = {};



export function createUnenumerableObject(target) { 
  const keys = Object.keys(target);   
  keys.forEach(key => {
    Object.defineProperty(target, key, {
      enumerable: false,  // 열거 불가능하게 설정
      value: target[key]  // 현재 값 유지
    });
  }); 
  return target;
}

//const obj = createUnenumerableObject({ a: 1, b: 2 });
export function forEach(target, callback) { 
 
  if (Array.isArray(target) || target instanceof NodeList) {  
    console.log(`[forEach][isArray]: ${target} ${JSON.stringify(target)}`)
    for (let i = 0; i < target.length; i++) {
      // value, idx
      callback(target[i], i);  
    }
    
  } else {  
    console.log(`[forEach][notArray]:${target} ${JSON.stringify(target)}`)
    const props = Object.getOwnPropertyNames(target); 
    console.log(`[forEach][Object.getOwnPropertyNames]:${props} ${JSON.stringify(props)}`)
    props.forEach(key => {
      
      // value, key
      callback(target[key], key);
      console.log(`Processing key: ${key}, value: ${target[key]}`); 

    });  
  } 

}
(function test (){
  const results = []
  const obj = createUnenumerableObject({ a: 1, b: 2 });
  const spans = document.querySelectorAll('#test span');
  forEach(obj, (value, key) => {
    console.log(`[test][obj][${key}][{${value}}]`)
    results.push({ value, key })
  });
  console.log(`obj ->[results]:${JSON.stringify(results)}`)
  results.length = 0
  forEach(['a', 'b'], (value, key) => {
    console.log(`[test][obj][${key}][{${value}}]`)
    results.push({ value, key })
  });
  console.log(`['a', 'b'] ->[results]:${JSON.stringify(results)}`)
  results.length = 0
  forEach(spans, (value, key) => {
    console.log(`[test][obj][${key}][{${value}}]`)
    results.push({ value, key })
  });
  console.log(`spans ->[results]:${JSON.stringify(results)}`)
})();


//const obj = createUnenumerableObject({ a: 1, b: 2 });
export function map(target, callback) {
  // const result = Array.isArray(target) || target instanceof NodeList ? [] : {};  
  if (target instanceof NodeList) {
    target = Array.from(target);
  }
  const result = Array.isArray(target) ? [] : {};  
  const keys = Array.isArray(target) ? [...target.keys()] : Reflect.ownKeys(target);
 
  for (const key of keys) {
    const value = target[key];
    const newValue = callback(value, key);
    if (Array.isArray(target)) {
      result.push(newValue);
    } else {
      result[key] = newValue;
    }
  }
  return result;
}

//const obj = createUnenumerableObject({ a: 1, b: 2 });
export function filter(target, callback) {
  if (target instanceof NodeList) {
    target = Array.from(target);
  }
  const result = Array.isArray(target) ? [] : {}; 
  const keys = Array.isArray(target) ? [...target.keys()] : Reflect.ownKeys(target);
  
  for (const key of keys) {
    const value = target[key];
    if (callback(value, key)) {  
      if (Array.isArray(target)) {
        result.push(value);  
      } else {
        result[key] = value; 
      }
    }
  }
  return result;
}


export function every(target, callback) {
  if (target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
  } else if (Array.isArray(target)) {   
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
  } else {   
    for (const key in target) {
      if (!callback(target[key], key)) {
        return false;
      }
    }
  }
  return true;
}


export function some(target, callback) {
  if (target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
  } else if (Array.isArray(target)) {   
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
  } else {   
    for (const key in target) {
      if (callback(target[key], key)) {
        return true;
      }
    }
  }
  return true;
}




