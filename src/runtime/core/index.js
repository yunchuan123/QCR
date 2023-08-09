import { onMountedRun } from "./lifrcycle/mounted.js";
import { setInstance, clearInstance } from "./instance/index.js";
import { clearRefMap } from "./dom/attribute/ref.js";

export function _carRender(tree) {
    return tree.renderFn();
}

export class CustomElement extends HTMLElement {
    constructor() {
        super();
        setInstance(this); // 设置this实例，方便useInstance调用
        const context = this.setup();
        clearInstance(); // 清除this实例，避免其他组件误用
        const shadowRoot = this.attachShadow({mode: "open"});
        let element;
        if (this.render) {
            element = _carRender(this.render(context));
        }
        this.style && shadowRoot.appendChild(this.style());

        if (element) {
            shadowRoot.appendChild(element);
        }
        onMountedRun(); // 开始处理mounted回调
        clearRefMap(); // 必须声明在mounted之后
    }
}

export { useInstance } from "./instance/index.js";
export { onMounted } from "./lifrcycle/index.js";
