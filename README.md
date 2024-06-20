## 🏆 목표
> _~ 06/20(목)_

```
💡 다음 파일의 일부 내용을 수정하여 테스트 코드가 통과하도록 만들어주세요

1. UseStateTest.tsx
2. UseMemoTest.tsx
3. PureComponentTest.tsx
4. UseCallbackTest.tsx
5. RequireRefactoring.tsx
```


### 📒 useState
> setState의 내용을 개선하여, 증가 버튼을 누르면 count의 값이 증가하도록 한다.
- ❌ 원인: state를 직접 수정함.
  - state에 직접 접근해 값을 변경할 시 화면에 재랜더링이 되지 않는다. 
  
- ✔️ 해결: 
  - (1) `setState`를 사용하여 값을 변경함.
    - setState를 호출했을 때에만 리액트 엔진이 자동으로 랜더링 함수를 트리거 시킨다.
  - (2) `전개 연산자`를 통해 값을 할당.
    - 전개 연산자는 얕은 복사가 되므로 모든 항목을 전개해주어야 한다.

### 📒 useMemo, memo
> useMemo를 사용하여 불필요한 값 연산을 방지한다.
>> 📌 [useMemo](https://ko.react.dev/reference/react/useMemo#usememo)    
> 함수 값은 인자를 받지 않고, 모든 타입의 값을 반환할 수 있어야 한다.
> 의존성 배열: 함수 내에서 참조된 모든 반응형 값들의 목록
- ❌ 원인: 재랜더링 반복
- ✔️ 해결: 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 `useMemo로 메모리에 저장`
  - 의존성 배열 안에있는 값이 업데이트 될 때에만 콜백 함수를 다시 호출하여 메모리에 저장된 값을 업데이트 해준다.


> PureComponent를 사용하여 불필요한 렌더링을 방지한다.
>> 📌 [React.memo](https://ko.react.dev/reference/react/memo#memo)    
> memo를 사용하면 컴포넌트의 props가 변경되지 않은 경우 리렌더링을 건너뛸 수 있다.
> 부모가 리렌더링되더라도 props가 변경되지 않는 한 리렌더링하지 않는다.
- useMemo와 유사하지만 memo는 [고차 컴포넌트](https://ko.legacy.reactjs.org/docs/higher-order-components.html) (컴포넌트를 가져와 새 컴포넌트를 반환하는 함수)


### 📒 useCallback, memo
> useCallback과 PureComponent를 사용하여 불필요한 렌더링을 방지한다.
>> 📌 [useCallback](https://ko.react.dev/reference/react/useCallback)
> 함수 정의를 캐싱해준다. (호출 개념이아닌 반환을 해준다.)


### 📒 Props 최적화
> useMemo나 useCallback을 사용하지 않고 props를 최적화하여 리렌더링을 방지할 수 있다.
- ✔️ useEffect hook 사용
- toHaveBeenCalledTimes >> 정확한 횟수만큼 호출되었는지 확인.


### 📒 useRef
> useRef와 똑같이 동작하는 useMyRef를 만들어서 사용할 수 있다.
- ❌ 원인:
  - useRef는 컴포넌트가 unmount가 되기 전까지 유지된다. + 리랜더를 일으키지 않음.
  - 요소가 모두 랜더링 되기 전에 ref값을 참조할 경우 null 값이 나오게 된다. >> 총 4개의 배열이 들어가게 됨


- ✔️ 해결: useEffect 내에서 ref를 참조한다.
  - useEffect는 컴포넌트가 mount된 후 실행된다. (컴포넌트가 랜더린 된 후)
  - 동일한 참조 객체를 유지하도록 ..
  - ⚠️ null 체크를 하지 않을 시 디버깅 시 {current: null} 이 담기게 됨.


## 📜 NOTE

> 📖 **useState**
> 1. state는 읽기 전용인 것처럼 다루기
> 2. 기존 객체를 변경하지 않고, 교체 해야 한다.
> 3. 리액트 공식문서에서는 setState의 동기적 실행을 위해 업데이터 함수를 사용하는 것을 권장한다. (+ 이전 state에서 계산되는 경우)
> 4. 리렌더링을 최적화할 때 (ex: useCallback...) 업데이터 함수를 대신 넘겨줌으로써 의존성을 제거할 수 있다. (권장)
> 5. useEffect 사용 시 업데이터 함수를 사용하여 state를 변경해야 의존성을 없앨 수 있다. (의존성 배열 작성 X)

> 📖 **useMemo, memo, useCallback**
> 1. Object.is 비교를 통해 각 의존성들을 이전 값과 비교 한다.
> 2. 성능 최적화를 위한 용도로만 사용해야 한다.
> 3. 가능한 적은 의존성을 갖는 것이 좋다.
> 4. - useMemo: 호출한 함수의 결과값을 캐싱 
>    - useCallback: 함수 자체를 캐싱
> ``` React 
> function useCallback(fn, dependencies) {
>   return useMemo(() => fn, dependencies);
> } 
> ```
 
> 📖 **useEffect**
> 1. 의존성을 선택할 수 없음 (함수 내 모든 반응형 값이 의존성)


> 📖 **useRef**
> 참고
> - [useRef()가 순수 자바스크립트 객체라는 의미를 곱씹어보기](https://dev.to/dylanju/useref-3j37?fbclid=IwAR0fl7xMjn_Hp6sImCU-EQt4gJ0ob_YY6hS3cwn4ARyClTUYD2KN0R6X-O0&source=post_page-----f0359ad23f3b--------------------------------)
> - [[React 코드 까보기] useRef는 DOM에 접근할 때 뿐만 아니라 다양하게 응용할 수 있어요.](https://flyingsquirrel.medium.com/react-코드-까보기-useref는-dom에-접근할-때-뿐만-아니라-다양하게-응용할-수-있어요-f0359ad23f3b)
> - react의 내부 코드에 있는 함수인데, 사실 이 함수는 react-dom에서 만든 함수이다.
> - 컴포넌트가 마운트될 때, 초기값을 저장. unmount 전 라이프사이클 동안 같은 값 유지된다.
> - react-dom의 전역변수로 접근하는 방식
