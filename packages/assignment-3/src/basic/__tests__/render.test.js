import { describe, expect, test } from "vitest";
import { jsx, render } from "../render";

describe("render > ", () => {
  describe("첫 번째 렌더링 테스트", () => {
    test("한 개의 태그를 렌더링할 수 있다.", () => {
      const App = jsx("div", null, "div의 children 입니다.");

      const $root = document.createElement("div");
      render($root, App);

      expect($root.innerHTML).toBe(`<div>div의 children 입니다.</div>`);
    });

    test("props를 추가할 수 있다.", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        "div의 children 입니다."
      );

      const $root = document.createElement("div");
      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class">div의 children 입니다.</div>`
      );
    });

    test("자식 노드를 표현할 수 있다.", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      const $root = document.createElement("div");
      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );
    });

    test("세 번째 뎁스 테스트", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx(
          "div",
          { id: "1" },
          jsx("p", null, "첫 번째 문단 첫 번째 글"),
          jsx("p", null, "첫 번째 문단 두 번째 글")
        ),
        jsx(
          "div",
          { id: "2" },
          jsx("p", null, "두 번째 문단 첫 번째 글"),
          jsx("p", null, "두 번째 문단 두 번째 글")
        )
      );

      const $root = document.createElement("div");
      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><div id="1"><p>첫 번째 문단 첫 번째 글</p><p>첫 번째 문단 두 번째 글</p></div><div id="2"><p>두 번째 문단 첫 번째 글</p><p>두 번째 문단 두 번째 글</p></div></div>`
      );
    });
  });

  describe("리렌더링 테스트 - 변경된 내용만 반영되도록 한다.", () => {
    test("하위 노드 추가", () => {
      const $root = document.createElement("div");

      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll("p")];

      render(
        $root,
        jsx(
          "div",
          { id: "test-id", class: "test-class" },
          jsx("p", null, "첫 번째 문단"),
          jsx("p", null, "두 번째 문단"),
          jsx("p", null, "세 번째 문단")
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll("p")];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
      expect(children[2]).not.toBe(newChildren[2]);
    });

    test("props 수정", () => {
      const $root = document.createElement("div");
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll("p")];

      render(
        $root,
        jsx(
          "div",
          null,
          jsx("p", null, "첫 번째 문단"),
          jsx("p", null, "두 번째 문단")
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll("p")];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
    });

    test("만약 newNode가 없고 oldNode만 있다면 parent에서 oldNode를 제거", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      const $root = document.createElement("div");
      render($root, App);

      render($root, undefined, jsx("p", null, "첫 번째 문단"));

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>두 번째 문단</p></div>`
      );
    });

    test("newNode와 oldNode의 타입이 다르다면 oldNode를 newNode로 교체", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      const $root = document.createElement("div");
      render($root, App);

      render(
        $root,
        jsx("span", null, "두 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><span>두 번째 문단</span></div>`
      );
    });

    test("만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면 oldNode를 newNode로 교체", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx("p", null, "첫 번째 문단"),
        jsx("p", null, "두 번째 문단")
      );

      const $root = document.createElement("div");
      render($root, App);

      render($root, "사실 세 번째 문단", "두 번째 문단");

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>사실 세 번째 문단</p></div>`
      );
    });

    test("세 번째 뎁스 및 newNode와 oldNode가 깊이를 가질 때 테스트", () => {
      const App = jsx(
        "div",
        { id: "test-id", class: "test-class" },
        jsx(
          "div",
          { id: "1" },
          jsx("p", null, "첫 번째 문단 첫 번째 글"),
          jsx("p", null, "첫 번째 문단 두 번째 글")
        ),
        jsx(
          "div",
          { id: "2" },
          jsx("p", null, "두 번째 문단 첫 번째 글"),
          jsx("p", null, "두 번째 문단 두 번째 글")
        )
      );

      const $root = document.createElement("div");
      render($root, App);

      render(
        $root,
        jsx(
          "div",
          { id: "test-id", class: "test-class" },
          jsx(
            "div",
            { id: "1" },
            jsx("p", null, "첫 번째 문단 첫 번째 글"),
            jsx("p", null, "첫 번째 문단 두 번째 글")
          ),
          jsx(
            "div",
            { id: "2" },
            jsx("p", null, "두 번째 문단 첫 번째 글"),
            jsx("p", null, "두 번째 문단 두 번째 글")
          ),
          jsx(
            "div",
            { id: "3" },
            jsx("p", null, "세 번째 문단 첫 번째 글"),
            jsx("p", null, "세 번째 문단 두 번째 글")
          )
        ),
        App
      );

      render(
        $root,
        jsx(
          "div",
          { id: "2" },
          jsx("p", null, "두 번째 문단 사실 세 번째 글"),
          jsx("p", null, "두 번째 문단 두 번째 글")
        ),
        jsx(
          "div",
          { id: "2" },
          jsx("p", null, "두 번째 문단 첫 번째 글"),
          jsx("p", null, "두 번째 문단 두 번째 글")
        )
      );

      render(
        $root,
        "두 번째 문단 사실 이게 진짜 세 번째 글",
        "두 번째 문단 두 번째 글"
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><div id="1"><p>첫 번째 문단 첫 번째 글</p><p>첫 번째 문단 두 번째 글</p></div><div id="2"><p>두 번째 문단 사실 세 번째 글</p><p>두 번째 문단 사실 이게 진짜 세 번째 글</p></div><div id="3"><p>세 번째 문단 첫 번째 글</p><p>세 번째 문단 두 번째 글</p></div></div>`
      );
    });
  });
});
