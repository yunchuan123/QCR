import { onMountedRun, collectionMountedFn } from "./lifrcycle/mounted.js";
import { setInstance, clearInstance } from "./instance/index.js";
import { setCollection, popColletion, setCurrentRefMap } from "./dom/attribute/custom/ref.js";
import { getProps, getReactiveProps, updateProp } from "./props/index.js";

import "./emit/index.js";

export function _carRender(tree) {
    return tree.renderFn();
}

export class CustomElement extends HTMLElement {
    constructor() {
        super();

        // 创建refs收集器 todo：待优化
        const refMap = new Map();
        setCollection(refMap);


        /**
         * setup - setup期间会收集声明周期函数，然后在相应的时间回调
         * 这段代码也说明了, useInstance 只能在setup中使用
         */
        const context = this.callSetup();
        
        this.processProps();

        // 结束收集mounted回调
        const mountedFns = collectionMountedFn();
        const shadowRoot = this.attachShadow({mode: "open"});

        let element;
        // render函数是编译模板自动生成的
        if (this.render) {
            element = _carRender(this.render(context));
            // 增加$forceRender api
            this.$forceRender = () => {
               const forceRenderElement = _carRender(this.render(context));
               shadowRoot.removeChild(shadowRoot.firstChild);
               shadowRoot.appendChild(forceRenderElement);
            }
        }
        // style 函数也是编译模板自动生成的
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

    callSetup() {
        // 设置this实例，方便useInstance调用
        setInstance(this);
        const context = this.setup();
        // 清除this实例，避免其他组件误用
        clearInstance();
        return context;
    }

    processProps() {
        /**
         * 开始处理props（创建响应式的props）
         */
        const propArr = getProps();
        const reactiveProps = getReactiveProps();
        this[updateProp] = (name, newValue) => {
            if (propArr.includes(name)) {
                reactiveProps[name] = newValue;
            }
        }
    }
}

export { useInstance } from "./instance/index.js";
export { onMounted } from "./lifrcycle/index.js";
