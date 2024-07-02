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

    test("두 번째 뎁스 테스트", () => {
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

      render(
        $root,
        jsx(
          "div",
          { id: "test-id", class: "test-class" },
          jsx("p", null, "두 번째 문단")
        ),
        App
      );

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
        jsx(
          "div",
          { id: "test-id", class: "test-class" },
          jsx("p", null, "첫 번째 문단"),
          jsx("span", null, "두 번째 문단")
        ),
        App
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

      render(
        $root,
        jsx(
          "div",
          { id: "test-id", class: "test-class" },
          jsx("p", null, "첫 번째 문단"),
          jsx("p", null, "사실 세 번째 문단")
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>사실 세 번째 문단</p></div>`
      );
    });

    test("newNode와 oldNode가 깊이를 가질 때 테스트", () => {
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

      const newApp = jsx(
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
      );

      render($root, newApp, App);

      const newApp2 = jsx(
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
          jsx("p", null, "두 번째 문단 사실 세 번째 글"),
          jsx("p", null, "두 번째 문단 두 번째 글")
        ),
        jsx(
          "div",
          { id: "3" },
          jsx("p", null, "세 번째 문단 첫 번째 글"),
          jsx("p", null, "세 번째 문단 두 번째 글")
        )
      );

      render($root, newApp2, newApp);

      const newApp3 = jsx(
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
          jsx("p", null, "두 번째 문단 사실 세 번째 글"),
          jsx("p", null, "두 번째 문단 사실 이게 진짜 세 번째 글")
        ),
        jsx(
          "div",
          { id: "3" },
          jsx("p", null, "세 번째 문단 첫 번째 글"),
          jsx("p", null, "세 번째 문단 두 번째 글")
        )
      );

      render($root, newApp3, newApp2);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><div id="1"><p>첫 번째 문단 첫 번째 글</p><p>첫 번째 문단 두 번째 글</p></div><div id="2"><p>두 번째 문단 사실 세 번째 글</p><p>두 번째 문단 사실 이게 진짜 세 번째 글</p></div><div id="3"><p>세 번째 문단 첫 번째 글</p><p>세 번째 문단 두 번째 글</p></div></div>`
      );
    });
  });

  describe("root의 모든 subtree에 대한 diff 연산이 잘 이루어지는지", () => {
    const App = jsx(
      "div",
      { id: "root", class: "root-class" },
      jsx(
        "div",
        { id: "depth1_a", class: "depth1_a-class" },
        jsx(
          "div",
          { id: "depth2_a_a", class: "depth2_a_a-class" },
          jsx(
            "a",
            { id: "depth3_a_a_a", class: "depth3_a_a_a-class" },
            "1-a-a-a"
          ),
          jsx(
            "a",
            { id: "depth3_a_a_b", class: "depth3_a_a_b-class" },
            "1-a-a-b"
          ),
          jsx(
            "a",
            { id: "depth3_a_a_c", class: "depth3_a_a_c-class" },
            "1-a-a-c"
          )
        ),
        jsx(
          "div",
          { id: "depth2_a_b", class: "depth2_a_b-class" },
          jsx(
            "a",
            { id: "depth3_a_b_a", class: "depth3_a_b_a-class" },
            "1-a-b-a"
          ),
          jsx(
            "a",
            { id: "depth3_a_b_b", class: "depth3_a_b_b-class" },
            "1-a-b-b"
          ),
          jsx(
            "a",
            { id: "depth3_a_b_c", class: "depth3_a_b_c-class" },
            "1-a-b-c"
          )
        ),
        jsx(
          "div",
          { id: "depth2_a_c", class: "depth2_a_c-class" },
          jsx(
            "a",
            { id: "depth3_a_c_a", class: "depth3_a_c_a-class" },
            "1-a-c-a"
          ),
          jsx(
            "a",
            { id: "depth3_a_c_b", class: "depth3_a_c_b-class" },
            "1-a-c-b"
          ),
          jsx(
            "a",
            { id: "depth3_a_c_c", class: "depth3_a_c_c-class" },
            "1-a-c-c"
          )
        )
      ),
      jsx(
        "div",
        { id: "depth1_b", class: "depth1_b-class" },
        jsx("div", { id: "depth2_b_a", class: "depth2_b_a-class" }, "1-b-a"),
        jsx("div", { id: "depth2_b_b", class: "depth2_b-b-class" }, "1-b-b"),
        jsx("div", { id: "depth2_b_c", class: "depth2_b_c-class" }, "1-b-c")
      ),
      jsx(
        "div",
        { id: "depth1_c", class: "depth1_c-class" },
        jsx("div", { id: "depth2_c_a", class: "depth2_c_a-class" }, "1-c-a"),
        jsx("div", { id: "depth2_c_b", class: "depth2_c-b-class" }, "1-c-b"),
        jsx(
          "div",
          { id: "depth2_c_c", class: "depth2_c_c-class" },
          jsx(
            "a",
            { id: "depth3_c_c_a", class: "depth3_c_c_a-class" },
            "1-c-c-a"
          ),
          jsx(
            "a",
            { id: "depth3_c_c_b", class: "depth3_c_c_b-class" },
            "1-c-c-b"
          ),
          jsx(
            "a",
            { id: "depth3_c_c_c", class: "depth3_c_c_c-class" },
            "1-c-c-c"
          )
        )
      )
    );

    test("첫 번째 렌더링 테스트", () => {
      const $root = document.createElement("div");

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="root" class="root-class"><div id="depth1_a" class="depth1_a-class"><div id="depth2_a_a" class="depth2_a_a-class"><a id="depth3_a_a_a" class="depth3_a_a_a-class">1-a-a-a</a><a id="depth3_a_a_b" class="depth3_a_a_b-class">1-a-a-b</a><a id="depth3_a_a_c" class="depth3_a_a_c-class">1-a-a-c</a></div><div id="depth2_a_b" class="depth2_a_b-class"><a id="depth3_a_b_a" class="depth3_a_b_a-class">1-a-b-a</a><a id="depth3_a_b_b" class="depth3_a_b_b-class">1-a-b-b</a><a id="depth3_a_b_c" class="depth3_a_b_c-class">1-a-b-c</a></div><div id="depth2_a_c" class="depth2_a_c-class"><a id="depth3_a_c_a" class="depth3_a_c_a-class">1-a-c-a</a><a id="depth3_a_c_b" class="depth3_a_c_b-class">1-a-c-b</a><a id="depth3_a_c_c" class="depth3_a_c_c-class">1-a-c-c</a></div></div><div id="depth1_b" class="depth1_b-class"><div id="depth2_b_a" class="depth2_b_a-class">1-b-a</div><div id="depth2_b_b" class="depth2_b-b-class">1-b-b</div><div id="depth2_b_c" class="depth2_b_c-class">1-b-c</div></div><div id="depth1_c" class="depth1_c-class"><div id="depth2_c_a" class="depth2_c_a-class">1-c-a</div><div id="depth2_c_b" class="depth2_c-b-class">1-c-b</div><div id="depth2_c_c" class="depth2_c_c-class"><a id="depth3_c_c_a" class="depth3_c_c_a-class">1-c-c-a</a><a id="depth3_c_c_b" class="depth3_c_c_b-class">1-c-c-b</a><a id="depth3_c_c_c" class="depth3_c_c_c-class">1-c-c-c</a></div></div></div>`
      );
    });

    test("트리 전체(루트 노트) 갱신 테스트", () => {
      const $root = document.createElement("div");

      render($root, App);

      const newApp = structuredClone(App);

      newApp.children[0].children[0].children[0].type = "span";

      newApp.children[0].children[1].children =
        newApp.children[0].children[1].children.slice(0, 1);

      newApp.children[0].children[2].children =
        newApp.children[0].children[2].children.slice(0, 2);

      newApp.children[1].children.push(
        jsx("a", { id: "depth2_b_d", class: "depth2_b_d-class" }, "1-b-d")
      );

      newApp.children[2].children[1].children[0] = "1-c-b-new";

      render($root, newApp, App);
      expect($root.innerHTML).toBe(
        `<div id="root" class="root-class"><div id="depth1_a" class="depth1_a-class"><div id="depth2_a_a" class="depth2_a_a-class"><span id="depth3_a_a_a" class="depth3_a_a_a-class">1-a-a-a</span><a id="depth3_a_a_b" class="depth3_a_a_b-class">1-a-a-b</a><a id="depth3_a_a_c" class="depth3_a_a_c-class">1-a-a-c</a></div><div id="depth2_a_b" class="depth2_a_b-class"><a id="depth3_a_b_a" class="depth3_a_b_a-class">1-a-b-a</a></div><div id="depth2_a_c" class="depth2_a_c-class"><a id="depth3_a_c_a" class="depth3_a_c_a-class">1-a-c-a</a><a id="depth3_a_c_b" class="depth3_a_c_b-class">1-a-c-b</a></div></div><div id="depth1_b" class="depth1_b-class"><div id="depth2_b_a" class="depth2_b_a-class">1-b-a</div><div id="depth2_b_b" class="depth2_b-b-class">1-b-b</div><div id="depth2_b_c" class="depth2_b_c-class">1-b-c</div><a id="depth2_b_d" class="depth2_b_d-class">1-b-d</a></div><div id="depth1_c" class="depth1_c-class"><div id="depth2_c_a" class="depth2_c_a-class">1-c-a</div><div id="depth2_c_b" class="depth2_c-b-class">1-c-b-new</div><div id="depth2_c_c" class="depth2_c_c-class"><a id="depth3_c_c_a" class="depth3_c_c_a-class">1-c-c-a</a><a id="depth3_c_c_b" class="depth3_c_c_b-class">1-c-c-b</a><a id="depth3_c_c_c" class="depth3_c_c_c-class">1-c-c-c</a></div></div></div>`
      );
    });

    test("특정 노트 갱신 테스트1", () => {
      const $root = document.createElement("div");

      render($root, App);

      render(
        $root,
        jsx(
          "a",
          { id: "depth3_c_c_b", class: "depth3_c_c_b-class" },
          "1-a-c-b-new"
        ),
        jsx("a", { id: "depth3_c_c_b", class: "depth3_c_c_b-class" }, "1-a-c-b")
      );

      render($root, "1-a-c-a-new", "1-a-c-a");

      // expect($root.innerHTML).toBe("dd");
    });
  });

  describe("render 함수 엣지 케이스 테스트", () => {
    test("문자열 노드 갱신 테스트", () => {
      const $root = document.createElement("div");

      render($root, jsx("p", null, "Hello"));

      expect($root.innerHTML).toBe("<p>Hello</p>");

      render($root, jsx("p", null, "World"), jsx("p", null, "Hello"));

      expect($root.innerHTML).toBe("<p>World</p>");
    });

    test("루트노드 삭제 테스트", () => {
      const $root = document.createElement("div");

      render($root, jsx("p", null, "Hello"));

      expect($root.innerHTML).toBe("<p>Hello</p>");

      render($root, undefined, jsx("p", null, "Hello"));

      expect($root.innerHTML).toBe("");
    });

    test("노드 타입 변경 테스트", () => {
      const $root = document.createElement("div");

      const oldNode = jsx("div", { id: "node" }, "Old Node");
      const newNode = jsx("span", { id: "node" }, "New Node");

      render($root, oldNode, null);

      expect($root.innerHTML).toBe('<div id="node">Old Node</div>');

      render($root, newNode, oldNode);

      expect($root.innerHTML).toBe('<span id="node">New Node</span>');
    });

    test("속성 변경 테스트 - 속성 제거", () => {
      const $root = document.createElement("div");

      const oldNode = jsx("div", { id: "node", class: "old-class" }, "Node");
      const newNode = jsx("div", { id: "node" }, "Node");

      render($root, oldNode, null);

      expect($root.innerHTML).toBe(
        '<div id="node" class="old-class">Node</div>'
      );

      render($root, newNode, oldNode);

      expect($root.innerHTML).toBe('<div id="node">Node</div>');
    });

    test("속성 변경 테스트 - 새로운 속성 추가", () => {
      const $root = document.createElement("div");

      const oldNode = jsx("div", { id: "node" }, "Node");
      const newNode = jsx("div", { id: "node", class: "new-class" }, "Node");

      render($root, oldNode, null);

      expect($root.innerHTML).toBe('<div id="node">Node</div>');

      render($root, newNode, oldNode);

      expect($root.innerHTML).toBe(
        '<div id="node" class="new-class">Node</div>'
      );
    });

    test("복잡한 노드 구조 변경 테스트", () => {
      const $root = document.createElement("div");

      const App = jsx(
        "div",
        { id: "tree" },
        jsx("div", { id: "branch1" }, "Branch 1"),
        jsx("div", { id: "branch2" }, "Branch 2")
      );

      const newApp = jsx(
        "div",
        { id: "tree" },
        jsx("div", { id: "branch1" }, "Branch 1 Updated"),
        jsx("div", { id: "branch3" }, "Branch 3")
      );

      render($root, App, null);

      expect($root.innerHTML).toBe(
        '<div id="tree"><div id="branch1">Branch 1</div><div id="branch2">Branch 2</div></div>'
      );

      render($root, newApp, App);

      expect($root.innerHTML).toBe(
        '<div id="tree"><div id="branch1">Branch 1 Updated</div><div id="branch3">Branch 3</div></div>'
      );
    });

    test("자식 노드 변경 테스트 - 순서 변경", () => {
      const $root = document.createElement("div");

      const App = jsx(
        "ul",
        { id: "list" },
        jsx("li", { id: "item1" }, "Item 1"),
        jsx("li", { id: "item2" }, "Item 2")
      );

      const newApp = jsx(
        "ul",
        { id: "list" },
        jsx("li", { id: "item2" }, "Item 2"),
        jsx("li", { id: "item1" }, "Item 1")
      );

      render($root, App, null);

      expect($root.innerHTML).toBe(
        '<ul id="list"><li id="item1">Item 1</li><li id="item2">Item 2</li></ul>'
      );

      render($root, newApp, App);

      expect($root.innerHTML).toBe(
        '<ul id="list"><li id="item2">Item 2</li><li id="item1">Item 1</li></ul>'
      );
    });

    test("빈 노드 처리 테스트", () => {
      const $root = document.createElement("div");

      render($root, null, null);

      expect($root.innerHTML).toBe("");

      render($root, jsx("div", null), null);

      expect($root.innerHTML).toBe("<div></div>");

      render($root, null, jsx("div", null));

      expect($root.innerHTML).toBe("");
    });

    test("다수의 자식 노드 제거 테스트", () => {
      const $root = document.createElement("div");

      const App = jsx(
        "ul",
        { id: "list" },
        jsx("li", { id: "item1" }, "Item 1"),
        jsx("li", { id: "item2" }, "Item 2"),
        jsx("li", { id: "item3" }, "Item 3")
      );

      const newApp = jsx(
        "ul",
        { id: "list" },
        jsx("li", { id: "item1" }, "Item 1")
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        '<ul id="list"><li id="item1">Item 1</li><li id="item2">Item 2</li><li id="item3">Item 3</li></ul>'
      );

      render($root, newApp, App);

      expect($root.innerHTML).toBe(
        '<ul id="list"><li id="item1">Item 1</li></ul>'
      );
    });
  });
});
