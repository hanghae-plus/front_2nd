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

/**  두 Object가 같은지 판별(deep)*/
const checkDeepObj = (data1, data2) => {
  const isDeepEqual = JSON.stringify(data1) === JSON.stringify(data2);
  return isDeepEqual;
};

/**해당 데이터가 어떤 타입의 데이터인지 판별하는 함수 */
const checkDataType = (data) => {
  if (Array.isArray(data)) {
    return [...data];
  } else {
    return { ...data };
  }
};

export { checkShallowObj, checkDeepObj, checkDataType };
