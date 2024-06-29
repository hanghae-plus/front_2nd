export function shallowEquals(target1, target2) {
    const a = target1;
    const b = target2;

    // 리터럴 객체 비교
    if (typeof a === "object" && a !== null && b !== null && a.constructor === Object && b.constructor === Object) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (let key of keysA) {
            if (a[key] !== b[key]) return false;
        }
        return true;
    }

    //null 비교
    if (a === null && b === null) return true;

    // 리터럴 배열일 때 빈값 비교 및 각 요소 비교
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    return target1 === target2;
}

export function deepEquals(target1, target2) {
    if (target1 === target2) {
        return true;
    }

    // 타입비교
    if (typeof target1 !== typeof target2) {
        return false;
    }

    // null 비교
    if (target1 === null || target2 === null) {
        return target1 === target2;
    }

    if (typeof target1 === "object" && typeof target2 === "object") {
        //래퍼객체일 경우 참조 메모리가 다르므로 false를 반환
        if (
            (target1 instanceof Number || target1 instanceof String || target1 instanceof Boolean) &&
            (target2 instanceof Number || target2 instanceof String || target2 instanceof Boolean)
        ) {
            return false;
        }

        if (target1.constructor !== target2.constructor) {
            return false;
        }

        //배열 비교
        if (Array.isArray(target1)) {
            if (target1.length !== target2.length) {
                return false;
            }

            //배열 내 값에 대한 깊은 비교를 실행
            for (let i = 0; i < target1.length; i++) {
                if (!deepEquals(target1[i], target2[i])) {
                    return false;
                }
            }
            return true;
        }

        //객체 비교
        const keys1 = Object.keys(target1);
        const keys2 = Object.keys(target2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (!deepEquals(target1[key], target2[key])) {
                return false;
            }
        }
        return true;
    }

    return false;
}

export function createNumber1(n) {
    //Symbol toPrimitive을 사용해 symbol 객체로 변환하여 비교
    return {
        value: n,
        [Symbol.toPrimitive](t) {
            if (t === "default") {
                return this.value;
            }
        },
    };
}

export function createNumber2(n) {
    return {
        value: n,
        [Symbol.toPrimitive](hint) {
            //연산자가 없을때 default > 문자열로 반환
            if (hint === "default") {
                return String(this.value);
            }
        },
    };
}

export function createNumber3(n) {
    return {
        value: n,
        [Symbol.toPrimitive](hint) {
            if (hint === "default") {
                return this.value;
            } else if (hint === "string") {
                return String(this.value);
            }
        },
        // 심볼에 JSON 메소드 추가
        toJSON() {
            return `this is createNumber3 => ${this.value}`;
        },
    };
}
export class CustomNumber {
    static data = new Object();

    constructor(n) {
        if (CustomNumber.data.hasOwnProperty(n)) {
            return CustomNumber.data[n];
        }
        this.value = n;
        CustomNumber.data[n] = this;
        return this;
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return "" + this.value;
    }

    toJSON() {
        return "" + this.value;
    }
}
export function createUnenumerableObject(target) {
    //target 객체를 순회하며 enumerable을 false로 설정
    for (let key in target) {
        Object.defineProperty(target, key, {
            value: target[key],
            enumerable: false,
        });
    }

    return target;
}

export function forEach(target, callback) {
    if (target.constructor.name === "Object") {
        const keys = Object.getOwnPropertyNames(target);
        keys.forEach((key) => {
            callback(target[key], key);
        });
        return;
    }

    target.forEach((v, i) => {
        callback(v, i);
    });
}

export function map(target, callback) {
    if (target.constructor.name === "Object") {
        const obj = {};
        const keys = Object.getOwnPropertyNames(target);
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = callback(target[keys[i]]);
        }
        return obj;
    }
    const arr = [];
    for (let i = 0; i < target.length; i++) {
        arr.push(callback(target[i]));
    }

    return arr;
}

export function filter(target, callback) {
    if (target.constructor.name === "Object") {
        const obj = {};
        const keys = Object.getOwnPropertyNames(target);
        for (let i = 0; i < keys.length; i++) {
            //true일때 실행
            if (callback(target[keys[i]])) {
                obj[keys[i]] = target[keys[i]];
            }
        }
        return obj;
    }
    const arr = [];

    //일치할경우 push
    for (let i = 0; i < target.length; i++) {
        if (callback(target[i])) {
            arr.push(target[i]);
        }
    }
    return arr;
}

export function every(target, callback) {
    //callback 조건을 모두 만족하면 true
    if (target.constructor.name === "Object") {
        const keys = Object.getOwnPropertyNames(target);

        for (let i = 0; i < keys.length; i++) {
            if (!callback(target[keys[i]])) return false;
        }

        return true;
    }

    for (let i = 0; i < target.length; i++) {
        if (!callback(target[i])) return false;
    }

    return true;
}

export function some(target, callback) {
    //callback 조건을 만족하면 true
    if (target.constructor.name === "Object") {
        const keys = Object.getOwnPropertyNames(target);
        for (let i = 0; i < keys.length; i++) {
            if (callback(target[keys[i]])) return true;
        }
        return false;
    }

    for (let i = 0; i < target.length; i++) {
        if (callback(target[i])) return true;
    }
    return false;
}
