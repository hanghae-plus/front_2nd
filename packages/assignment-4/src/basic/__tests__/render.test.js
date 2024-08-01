import { describe, expect, it } from "vitest";
import {
  appendChildElement,
  appendSelectOptions,
  createDOMElement,
  setAttribute,
} from "../render";

describe("render test", () => {
  describe("createDOMElement", () => {
    it("name과 options를 받아서 새로운 DOM Element를 생성한다.", () => {
      const name = "div";
      const options = {
        className: "container",
      };

      const newElement = createDOMElement({ name, options });

      expect(newElement).toBeInstanceOf(HTMLElement);
      expect(newElement.tagName).toBe(name.toUpperCase());
      expect(newElement.className).toBe(options.className);
    });

    it("options가 여러개인 경우 모든 옵션을 적용한다.", () => {
      const name = "div";
      const options = {
        className: "container",
        id: "container",
        textContent: "Hello, World!",
      };

      const newElement = createDOMElement({ name, options });

      expect(newElement).toBeInstanceOf(HTMLElement);
      expect(newElement.tagName).toBe(name.toUpperCase());
      expect(newElement.className).toBe(options.className);
      expect(newElement.id).toBe(options.id);
      expect(newElement.textContent).toBe(options.textContent);
    });

    it("옵션에 data set를 설정할 수 있다.", () => {
      const name = "div";
      const options = {
        dataset: { productId: "product-id" },
      };

      const newElement = createDOMElement({ name, options });

      expect(newElement.dataset.productId).toEqual(options.dataset.productId);
    });
  });

  describe("appendChildElement", () => {
    it("parent에 children을 추가할 수 있다.", () => {
      const parent = document.createElement("div");
      const children = [
        document.createElement("span"),
        document.createElement("span"),
      ];

      const appendedElement = appendChildElement({ parent, children });

      expect(appendedElement.children.length).toBe(children.length);
      expect(appendedElement.children[0]).toBe(children[0]);
      expect(appendedElement.children[1]).toBe(children[1]);
    });
  });

  describe("appendSelectOptions", () => {
    it("select에 options을 추가할 수 있다.", () => {
      const select = document.createElement("select");
      const options = {
        1: { id: 1, name: "상품1", price: 1000 },
        2: { id: 2, name: "상품2", price: 2000 },
      };

      const appendedSelect = appendSelectOptions({ select, options });

      expect(appendedSelect.children.length).toBe(Object.keys(options).length);

      for (let i = 0; i < appendedSelect.children.length; i++) {
        const option = appendedSelect.children[i];
        const optionKey = Object.keys(options)[i];
        const optionValue = options[optionKey];

        expect(option.value).toBe(optionValue.id.toString());
        expect(option.textContent).toBe(
          `${optionValue.name} - ${optionValue.price}원`,
        );
      }
    });
  });

  describe("setAttribute", () => {
    it("element에 attributes를 설정할 수 있다.", () => {
      const element = document.createElement("div");
      const attributes = {
        className: "container",
        id: "container",
        textContent: "Hello, World!",
      };

      const setElement = setAttribute({ element, attributes });

      expect(setElement.className).toBe(attributes.className);
      expect(setElement.id).toBe(attributes.id);
      expect(setElement.textContent).toBe(attributes.textContent);
    });
  });
});
