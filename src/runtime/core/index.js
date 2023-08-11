import { onMountedRun, collectionMountedFn } from "./lifrcycle/mounted.js";
import { setInstance, clearInstance } from "./instance/index.js";
import { setCollection, popColletion, setCurrentRefMap } from "./dom/attribute/custom/ref.js";

export function _carRender(tree) {
    return tree.renderFn();
}

const defaultEventOptions = {
    bubbles: true,  // 事件会冒泡
    composed: true, // 事件可以穿越shadow DOM边界
    detail: { data: undefined }
}

HTMLElement.prototype.$emit = function(name, value, options = {}) {
    const _options = Object.assign(defaultEventOptions, options);
    _options.detail.data = value;
    const event = new CustomEvent(name, _options);
    this.dispatchEvent(event);
};

HTMLElement.prototype.$listen = function(eventName, fn) {
    this.addEventListener(eventName, (e) => fn(e.detail.data))
}


export class CustomElement extends HTMLElement {
    constructor() {
        super();
        // 创建refs收集器 todo：待优化
        const refMap = new Map();
        setCollection(refMap);

        // setup - setup期间会收集声明周期函数，然后在相应的时间回调
        setInstance(this); // 设置this实例，方便useInstance调用
        const context = this.setup();
        clearInstance(); // 清除this实例，避免其他组件误用

        // 结束收集mounted回调
        const mountedFns = collectionMountedFn();
        const shadowRoot = this.attachShadow({mode: "open"});
        let element;
        if (this.render) {
            element = _carRender(this.render(context));
        }
        this.style && shadowRoot.appendChild(this.style());

        if (element) {
            shadowRoot.appendChild(element);
        }

        // 设置当前refs todo：待优化
        setCurrentRefMap(refMap);

        // 开始处理mounted回调
        onMountedRun(mountedFns);

        // 弹出refs收集器 todo：待优化
        popColletion();
    }
}

export { useInstance } from "./instance/index.js";
export { onMounted } from "./lifrcycle/index.js";
