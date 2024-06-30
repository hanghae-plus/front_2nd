import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const _render = () => {};
  function render($root, rootComponent) {}

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
