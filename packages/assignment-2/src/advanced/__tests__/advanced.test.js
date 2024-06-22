import { it, describe, expect } from "vitest";
import { memo1, memo2 } from "../advanced.js";

let a;
let b;

describe('assignment 2 > advanced : 값을 캐시하기', () => {
  it.each([
    { fn: () => Array.from({ length: a }).map((_, k) => k + 1) },
    { fn: () => Array.from({ length: a }).map((_, k) => k * 10) },
  ])('memo1 $fn > ', ({ fn }) => {
    a = 1000000;
    expect(fn() === fn()).toBe(false);
    expect(memo1(fn) === memo1(fn)).toBe(true);
    a = 1;
    expect(fn().length).toBe(1);
    expect(memo1(fn).length).toBe(1000000);
  })

  it.each([
    { fn: () => Array.from({ length: a * b }).map((_, k) => k + 1) },
    { fn: () => Array.from({ length: a * b }).map((_, k) => k * 10) }
  ])('memo2 $fn > ', ({ fn }) => {
    a = 100;
    b = 100;
    expect(fn() === fn()).toBe(false);
    expect(memo2(fn, [a]) === memo2(fn, [a])).toBe(true);
    a = 1;
    expect(fn().length).toBe(100);
    expect(memo2(fn, [a]).length).toBe(100);
    b = 1;
    expect(fn().length).toBe(1);
    expect(memo2(fn, [a]).length).toBe(100);
  })
})
