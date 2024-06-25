function createUnenumerableObject(target) {
  const obj = structuredClone(target);

  for (let key in obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.defineProperty(obj, key, {
      ...descriptor,
      enumerable: false,
    });
  }

  return obj;
}

function forEach(target, callback) {
  const keys = Object.getOwnPropertyNames(target);
  keys.forEach((key) => {
    if (key === "length") return;
    console.log(key, Number.isInteger(key));
    callback(
      Number.isInteger(+target[key]) ? +target[key] : target[key],
      Number.isInteger(+key) ? +key : key
    );
  });
}

const results = [];
const obj = createUnenumerableObject({ a: 1, b: 2 });
forEach(obj, (value, key) => results.push({ value, key }));
console.log(results);

const results2 = [];
const obj2 = createUnenumerableObject(["a", "b"]);
forEach(obj2, (value, key) => results2.push({ value, key }));
console.log(results2);
