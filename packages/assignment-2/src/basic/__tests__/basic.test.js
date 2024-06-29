import { describe, expect, it, beforeEach } from "vitest";
import { createNumber1, createNumber2, createNumber3, CustomNumber, deepEquals, shallowEquals, forEach, map, filter, some, every, createUnenumerableObject, } from "../basic";

describe('assignment 2 > basic : 값을 다루기', () => {
  describe('객체를 다뤄봅시다.', () => {
    it('값 비교', () => {
      expect(1 === 1).toBe(true);
      expect(1 === 2).toBe(false);
      expect(true === true).toBe(true);
      expect(false === false).toBe(true);
      expect("1" === "1").toBe(true);
      expect("1" == 1).toBe(true);
      expect("1" == true).toBe(true);
      expect("0" == false).toBe(true);
      expect(null == undefined).toBe(true);
      expect(null == false).toBe(false);
      expect(false == undefined).toBe(false);
      expect("1" === 1).toBe(false);
      expect("1" === true).toBe(false);
      expect("0" === false).toBe(false);
      expect(0 === false).toBe(false);
      expect(null === undefined).toBe(false);
      expect(null === false).toBe(false);
      expect(false === undefined).toBe(false);
      expect(false === undefined).toBe(false);
    })

    it('객체/배열/함수 비교', () => {
      expect({} === {}).toBe(false);
      expect([] === []).toBe(false);

      const a = {};
      const b = a;
      expect(a === b).toBe(true);

      const foo = { a, b: [], c: 1 };
      const bar = { a, b: [], c: 1, foo };
      const fn = () => null;
      const fn2 = () => null;
      const fn3 = fn;
      expect(foo === bar).toBe(false);
      expect(foo.a === bar.a).toBe(true);
      expect(foo.b === bar.b).toBe(false);
      expect(foo.c === bar.c).toBe(true);
      expect(foo === bar.foo).toBe(true);
      expect(fn === (() => null)).toBe(false);
      expect(fn2 === (() => null)).toBe(false);
      expect(fn === fn2).toBe(false);
      expect(fn === fn3).toBe(true);
      expect(fn.toString() === fn2.toString()).toBe(true);
      expect(fn.toString() === (() => null).toString()).toBe(true);
      expect((() => null).toString() === (() => null).toString()).toBe(true);
    })

    it.each([
      { target1: new Number(1), target2: new Number(1), expected: false },
      { target1: new String(1), target2: new String(1), expected: false },
      {
        target1: new class {
        }(), target2: new class {
        }(), expected: false
      },
      { target1: {}, target2: {}, expected: true },
      { target1: 1, target2: 1, expected: true },
      { target1: [], target2: [], expected: true },
      { target1: 'abc', target2: 'abc', expected: true },
      { target1: null, target2: null, expected: true },
      { target1: undefined, target2: undefined, expected: true },
      { target1: [1, 2, 3], target2: [1, 2, 3], expected: true },
      { target1: [1, 2, 3, [4]], target2: [1, 2, 3, [4]], expected: false },
      { target1: [1, 2, 3, { foo: 1 }], target2: [1, 2, 3, { foo: 1 }], expected: false },
      { target1: [1, 2], target2: [1, 2, 3], expected: false },
      { target1: { a: 1 }, target2: { a: 1 }, expected: true },
      { target1: { a: 1 }, target2: { a: 2 }, expected: false },
      { target1: { a: 1, b: { c: 2 } }, target2: { a: 1, b: { c: 2 } }, expected: false },
    ])('shallowEquals($target1, $target2) === $expected', ({ target1, target2, expected }) => {
      expect(shallowEquals(target1, target2)).toBe(expected);
    })

    it.each([
      { target1: new Number(1), target2: new Number(1), expected: false },
      { target1: new String(1), target2: new String(1), expected: false },
      {
        target1: new class {
        }(), target2: new class {
        }(), expected: false
      },
      { target1: {}, target2: {}, expected: true },
      { target1: 1, target2: 1, expected: true },
      { target1: [], target2: [], expected: true },
      { target1: 'abc', target2: 'abc', expected: true },
      { target1: null, target2: null, expected: true },
      { target1: undefined, target2: undefined, expected: true },
      { target1: [1, 2, 3], target2: [1, 2, 3], expected: true },
      { target1: [1, 2, 3, [4]], target2: [1, 2, 3, [4]], expected: true },
      { target1: [1, 2, 3, { foo: 1 }], target2: [1, 2, 3, { foo: 1 }], expected: true },
      { target1: [1, 2], target2: [1, 2, 3], expected: false },
      { target1: { a: 1 }, target2: { a: 1 }, expected: true },
      { target1: { a: 1 }, target2: { a: 2 }, expected: false },
      {
        target1: { a: 1, b: { c: 2, d: [], e: [1, 2, 3] } },
        target2: { a: 1, b: { c: 2, d: [], e: [1, 2, 3] } },
        expected: true
      },
      {
        target1: { a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } },
        target2: { a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } },
        expected: false
      },
    ])('deepEquals($target1, $target2) === $expected', ({ target1, target2, expected }) => {
      expect(deepEquals(target1, target2)).toBe(expected);
    })
  })

  describe('number를 다뤄봅시다.', () => {
    it('createNumber1 > ', () => {
      const num1 = createNumber1(1);
      const num2 = createNumber1(2);
      expect(num1 + num2).toBe(3);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
    })

    it('createNumber2 >', () => {
      const num1 = createNumber2(1);
      const num2 = createNumber2(2);
      expect(num1 + num2).toBe("12");
      expect(1 + num2).toBe("12");
      expect(num1 + 2).toBe("12");
      expect(num1 === "1").toBe(false);
      expect(num2 === "2").toBe(false);
      expect(num1 == "1").toBe(true);
      expect(num2 == "2").toBe(true);
      expect(typeof num1 === 'string').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('createNumber3 > ', () => {
      const num1 = createNumber3(1);
      const num2 = createNumber3(2);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(JSON.stringify(num1)).toBe('"this is createNumber3 => 1"');
      expect(JSON.stringify(num2)).toBe('"this is createNumber3 => 2"');
      expect(JSON.stringify(num1 + num2)).toBe('3');
      expect(JSON.stringify(`${num1}${num2}`)).toBe('"12"');
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('createNumber3 > ', () => {
      const num1 = createNumber3(1);
      const num2 = createNumber3(2);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(JSON.stringify(num1)).toBe('"this is createNumber3 => 1"');
      expect(JSON.stringify(num2)).toBe('"this is createNumber3 => 2"');
      expect(JSON.stringify(num1 + num2)).toBe('3');
      expect(JSON.stringify(`${num1}${num2}`)).toBe('"12"');
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('CustomNumber > ', () => {
      const num1 = new CustomNumber(1);
      const num2 = new CustomNumber(2);
      const num3 = new CustomNumber(1);
      const num4 = new CustomNumber(2);
      expect(num1 === 1).toBe(false);
      expect(num2 === 2).toBe(false);
      expect(num3 === 1).toBe(false);
      expect(num4 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(num3 == 1).toBe(true);
      expect(num4 == 2).toBe(true);
      expect(num1).toBe(num3);
      expect(num2).toBe(num4);
      expect(num1 + num2).toBe(3);
      expect(num3 + num4).toBe(3);
      expect(num1 + num3).toBe(2);
      expect(num2 + num4).toBe(4);
      expect(num3 + `${num4}`).toBe("12");
      expect(num1 + `${num2}`).toBe("12");
      expect(num1 + `${num3}`).toBe("11");
      expect(num2 + `${num4}`).toBe("22");
      expect(JSON.stringify(num3) + `${num4}`).toBe('"1"2');
      expect(JSON.stringify(num1) + `${num2}`).toBe('"1"2');
      expect(JSON.stringify(num1) + `${num3}`).toBe('"1"1');
      expect(JSON.stringify(num2) + `${num4}`).toBe('"2"2');
    })
  })

  describe('Array와 Object를 동시에 다룰 수 있는 함수를 만들어봅시다.', () => {
    beforeEach(() => {
      document.body.innerHTML = `<div id="test"><span>1</span><span>2</span></div>`;
    })

    const obj = createUnenumerableObject({ a: 1, b: 2 });

    it('createUnenumerableObject > ', () => {
      expect(obj.a).toEqual(1);
      expect(obj.b).toEqual(2);
      expect({ ...obj }).toEqual({});
    })

    it('forEach > ', () => {
      const results = [];
      forEach(obj, (value, key) => results.push({ value, key }));
      expect(results).toStrictEqual([{ value: 1, key: 'a' }, { value: 2, key: 'b' }]);
      results.length = 0;

      forEach(['a', 'b'], (value, key) => results.push({ value, key }));
      expect(results).toStrictEqual([{ value: 'a', key: 0 }, { value: 'b', key: 1 }]);
      results.length = 0;


      const spans = document.querySelectorAll('#test span');
      forEach(spans, (value, key) => results.push({ value, key }));
      expect(results).toStrictEqual([{ value: spans[0], key: 0 }, { value: spans[1], key: 1 }]);
    })

    it('map > ', () => {
      const objectResult = map(obj, (value) => value * 2);
      expect(objectResult).toStrictEqual({ a: 2, b: 4 });

      const arrayResult = map(['a', 'b'], (value) => value.toUpperCase());
      expect(arrayResult).toStrictEqual(['A', 'B']);

      const spans = document.querySelectorAll('#test span');
      const spansResult = map(spans, (value) => value.textContent);
      expect(spansResult).toStrictEqual(['1', '2']);
    });

    it('filter > ', () => {
      const objectResult = filter(obj, (value) => value > 1);
      expect(objectResult).toStrictEqual({ b: 2 });

      const arrayResult = filter(['a', 'b'], (value) => value === 'b');
      expect(arrayResult).toStrictEqual(['b']);

      const spans = document.querySelectorAll('#test span');
      const spansResult = filter(spans, (value) => value.textContent === '2');
      expect(spansResult).toStrictEqual([spans[1]]);
    });

    it('every > ', () => {
      const objectResult = every(obj, (value) => value > 0);
      expect(objectResult).toBe(true);

      const arrayResult = every(['a', 'b'], (value) => typeof value === 'string');
      expect(arrayResult).toBe(true);

      const spans = document.querySelectorAll('#test span');
      const spansResult = every(spans, (value) => value.tagName === 'SPAN');
      expect(spansResult).toBe(true);
    });

    it('some > ', () => {
      const objectResult = some(obj, (value) => value > 1);
      expect(objectResult).toBe(true);

      const arrayResult = some(['a', 'b'], (value) => value === 'a');
      expect(arrayResult).toBe(true);

      const spans = document.querySelectorAll('#test span');
      const spansResult = some(spans, (value) => value.textContent === '1');
      expect(spansResult).toBe(true);
    });
  })



})
