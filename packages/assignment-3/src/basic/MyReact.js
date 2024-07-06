import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
    //외부값 설정
    let root = null;
    let rootComponent = null;

    const _render = () => {
        if (!root || !rootComponent) return;

        //렌더링시 초기화한다
        resetHookContext();

        root.innerHTML = "";

        //jsx 반환
        const jsx = rootComponent();

        //DOM 렌더링
        updateElement(root, jsx);
    };

    //render를 호출하여 root와 component를 설정
    function render($root, component) {
        root = $root;
        rootComponent = component;
        _render();
    }

    const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

    return { render, useState, useMemo };
}

export default MyReact();
