/** 두 요소가 array인지 판별 하는 함수 */
const isArray = (data1, data2) => {
  return Array.isArray(data1), Array.isArray(data2);
};

/** 두 요소의 contructor가 Object인지 확인하는 함수 */
const isConstructorTypeObject = (data1, data2) => {
  return data1.constructor === Object && data2.constructor === Object;
};

/**  두 Object가 같은지 판별(shallow)*/
const checkShallowObj = (data1, data2) => {
  //value값 뽑아내기
  const arr1 = Object.values(data1);
  const arr2 = Object.values(data2);

  //value arr길이 가 같고, 요소들이 빠짐없이 같은지 판별
  const isEqual =
    arr1.length === arr2.length && arr1.every((ele, idx) => ele === arr2[idx]);

  return isEqual;
};

/**해당 데이터가 어떤 타입의 데이터인지 판별하는 하여 값을 복사함 */
const cloneData = (data) => {
  if (Array.isArray(data)) {
    return [...data];
  } else {
    const newObj = {};

    //property 조회
    const descriptor = Object.getOwnPropertyDescriptors(data);

    //length 속성을 제외한 key뽑아내기
    const descriptorKey = Object.keys(descriptor).filter(
      (ele) => ele !== "length"
    );

    for (let key of descriptorKey) {
      const value = descriptor[key].value;
      newObj[key] = value;
    }
    return { ...newObj };
  }
};

export { checkShallowObj, cloneData, isArray, isConstructorTypeObject };
