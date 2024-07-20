import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRoot = null; // 현재 렌더링할 루트 DOM 요소
  let currentComponent = null; // 현재 렌더링할 루트 컴포넌트 함수
  let oldComponent = null; // 이전에 렌더링된 컴포넌트 상태

  // 컴포넌트를 다시 렌더링하는 함수
  const _render = () => {
    resetHookContext(); // 훅의 상태 인덱스 초기화
    const newElement = currentComponent(); // 새로운 JSX 요소 생성
    updateElement(currentRoot, newElement, oldComponent); // currentRoot에 새로운 요소 렌더링, 이전 요소와 비교하여 업데이트
    oldComponent = newElement; // 현재 컴포넌트로 업데이트
  };

  // 처음 컴포넌트를 렌더링하는 함수
  function render($root, rootComponent) {
    resetHookContext(); // 훅의 상태 인덱스 초기화
    currentRoot = $root; // 현재 렌더링할 루트 DOM 요소
    currentComponent = rootComponent; // 현재 렌더링할 루트 컴포넌트 함수
    const newElement = currentComponent(); // 새로운 JSX 요소 생성
    updateElement(currentRoot, newElement); // currentRoot에 새로운 요소 렌더링
    oldComponent = newElement; // 현재 컴포넌트로 업데이트
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
