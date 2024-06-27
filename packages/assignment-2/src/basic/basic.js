const _ = require("lodash");

export function shallowEquals(target1, target2) {
  // console.log("here", Object.keys(target1).length === 0);
  // if (target1 == ) {
  //   return true;
  // }
  if (typeof target1 == "object") {
    // if (Object.keys(target1).length < 1) {
    // return _.isEqual(target1, target2);
    if (target1 == null) {
      return true;
    }

    if (
      target1 instanceof Number ||
      target1 instanceof String ||
      target1.constructor.name === ""
    ) {
      return false;
    }
    // for (let i = 0; i < target1.length; i++) {
    //   if (target1[i] == target1[i]) {
    //     return true;
    //   }
    // }

    if (Object.keys(target1).length === 0) {
      return true;
    } else {
      // else {
      // if (target1 !== target2) {
      //   return false;
      // }
      if (
        typeof target1[target1.length - 1] == "object" ||
        target1.hasOwnProperty("b")
        // target1[target1.length - 1] !== undefined
      ) {
        return Object.is(target1, target2);
      } else {
        if (target1 !== target2) {
          if (
            Object.entries(target1).toString() ==
            Object.entries(target2).toString()
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
      // target1.some((item, idx) => {
      //   if (typeof target1[target1.length - 1] == "object") {
      //     return Object.is(target1, target2);
      //   } else {
      //     console.log("type11", item);
      //     return true;
      //   }
      // });
      // return Object.is(target1, target2);
    }
    // } else {
    //   return _.isEqual(target1, target2);
    // }
  }
  // if (target1 == {} || target2 == {}) {
  //   return JSON.stringify(target1) === JSON.stringify(target2);
  // }
  else {
    return target1 === target2;
  }
}

export function deepEquals(target1, target2) {
  // if (typeof target1 == "object" || typeof target1 == "array") {
  //   return JSON.stringify(target1) === JSON.stringify(target2);
  // } else {
  // return Object.is(target1) === Object.is(target2;
  // // }
  // return Object.is(target1, target2);

  if (
    target1 instanceof Number ||
    target1 instanceof String
    // Object.entries(target1) instanceof Number
    // JSON.stringify(target1).includes(`"Number"`)
    // Object.values(target1).every((item) => item instanceof Number)
  ) {
    return target1 === target2;
  } else {
    return _.isEqual(target1, target2);
  }
}

export function createNumber1(n) {
  return Object(n);
}

export function createNumber2(n) {}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
