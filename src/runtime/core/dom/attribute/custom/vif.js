import { effect } from "@vue/reactivity";
import { isFunction } from "../../../../utils/general.js";

export const vifAttributeHandler = {
    name: "v-if",
    /**
     * v-if 的处理器
     * @param {{el: HTMLElement, value: string | function}} param0
     */
    handler({el, value}) {
        let _parentElement;
        let _el = el;
        // 创建占位元素
        const _temp_div = document.createElement("div");
        _temp_div.style.display = "none";

        effect(() => {
            // 异步保证父元素已经加载
            Promise.resolve(value()).then((res) => {
                _parentElement = _parentElement || _el.parentElement;

                if (res && !_parentElement.contains(_el)) {
                    // 重启生命周期
                    isFunction(_el.setup) && _el.setup();

                    _parentElement.insertBefore(_el, _temp_div);
                    _parentElement.removeChild(_temp_div);
                } else if (!res && _parentElement.contains(_el)) {
                    _parentElement.insertBefore(_temp_div, _el);
                    _parentElement.removeChild(_el);
                }
            })
        })
    }
}
