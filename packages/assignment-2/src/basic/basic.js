// 두 Object가 같은지 판별(shallow)
const checkShallowObj = (data1, data2) => {
  //value값 뽑아내기
  const arr1 = Object.values(data1);
  const arr2 = Object.values(data2);

  //value arr길이 가 같고, 요소들이 빠짐없이 같은지 판별
  const isEqual =
    arr1.length === arr2.length && arr1.every((ele, idx) => ele === arr2[idx]);

  return isEqual;
};

//얕은 비교를 수행하는 함수
export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return target1 === target2;
  }

  // Array일 때
  if ((Array.isArray(target1), Array.isArray(target2))) {
    return checkShallowObj(target1, target2);
  }

  // constructor가 Object인지 판별
  if (target1.constructor !== Object && target2.constructor !== Object) {
    return false;
  }

  return checkShallowObj(target1, target2);
}

// 두 Object가 같은지 판별(deep)
const checkDeepObj = (data1, data2) => {
  const isDeepEqual = JSON.stringify(data1) === JSON.stringify(data2);
  return isDeepEqual;
};

//깊은 비교를 수행하는 함수
export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return target1 === target2;
  }

  // Array일 때
  if ((Array.isArray(target1), Array.isArray(target2))) {
    return checkDeepObj(target1, target2);
  }

  // constructor가 Object인지 판별
  if (target1.constructor !== Object && target2.constructor !== Object) {
    return false;
  }

  return checkDeepObj(target1, target2);
}

export function createNumber1(n) {
  return Number(n);
}

export function createNumber2(n) {
  return Number(n);
  // return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {
  let copyTarget;

  //해당 데이터가 어떤 타입의 데이터인지 판별하는 함수
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  //외부 부수효과가 나지 않도록 복사
  copyTarget = checkDataType(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [key, value] = ele;

    //
    const newKey = !isNaN(Number(key)) ? Number(key) : key;
    const newValue = !isNaN(Number(value)) ? Number(value) : value;

    callback(newValue, newKey);
  }
}

export function map(target, callback) {
  let copyTarget;

  //해당 데이터가 어떤 타입의 데이터인지 판별하는 함수
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  //외부 부수효과가 나지 않도록 복사
  copyTarget = checkDataType(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  //NodeList라면 array형태로 콜백 값 넣어주기
  if (target instanceof NodeList) {
    const newData = [];
    for (let ele of objArr) {
      const value = ele[1];
      const newValue = callback(value);
      newData.push(newValue);
    }
    return newData;
  } else {
    //array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기
    for (let ele of objArr) {
      const [key, value] = ele;
      const newValue = callback(value);
      copyTarget[key] = newValue;
    }

    return copyTarget;
  }
}

export function filter(target, callback) {
  let copyTarget;

  //해당 데이터가 어떤 타입의 데이터인지 판별하는 함수
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  //외부 부수효과가 나지 않도록 복사
  copyTarget = checkDataType(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  //NodeList라면 array형태로 콜백 값 넣어주기
  if (target instanceof NodeList) {
    const newData = [];
    for (let ele of objArr) {
      const value = ele[1];
      if (!callback(value)) {
        continue;
      }
      newData.push(value);
    }
    return newData;
  } else {
    //array, object라면 key값 그대로 사용하고 value는 콜백 넣어주기
    const newData = {};
    for (let ele of objArr) {
      const [key, value] = ele;

      //callback filter조건을 통과하지 못하면 conrinue
      if (!callback(value)) {
        continue;
      }

      newData[key] = value;
    }

    //array일 경우 value만 뽑아서 return
    return Array.isArray(target) ? Object.values(newData) : newData;
  }
}

export function every(target, callback) {
  let copyTarget;

  //해당 데이터가 어떤 타입의 데이터인지 판별하는 함수
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  //외부 부수효과가 나지 않도록 복사
  copyTarget = checkDataType(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [, value] = ele;
    //요소가 하나라도 callback조건을 통과 못하면 return false
    if (!callback(value)) {
      return false;
    }
  }

  return true;
}

export function some(target, callback) {
  let copyTarget;

  //해당 데이터가 어떤 타입의 데이터인지 판별하는 함수
  const checkDataType = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    } else {
      return { ...data };
    }
  };

  //외부 부수효과가 나지 않도록 복사
  copyTarget = checkDataType(target);

  //object key,value 뽑기
  const objArr = Object.entries(copyTarget);

  for (let ele of objArr) {
    const [, value] = ele;
    //요소가 하나라도 callback조건을 통과 못하면 return false
    if (callback(value)) {
      return true;
    }
  }

  return false;
}
