import { createHooks } from "./hooks";
import { render as updateElement } from "./render";
import { deepEquals } from "../../../assignment-2/src/basic/basic.js";

/*
  render와 hooks를 결합하여 MyReact의 내용을 채워야합니다.
 */

function MyReact() {
  let root = {
    $root: null,
    newElement: null,
  };

  const _render = () => {
    resetHookContext();
    const [state, setState] = useState(null);
    const newElement = root.newElement();
    console.log("state", state);
    console.log("newElement", newElement);
    updateElement(root.$root, newElement, state);

    // resetHookContext();
    setState(newElement);
  };

  function render($root, rootComponent) {
    root = { ...root, $root, newElement: rootComponent };

    resetHookContext();
    useMemo(() => {
      _render();
    }, [root]);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
