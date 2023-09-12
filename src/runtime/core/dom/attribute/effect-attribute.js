import { effect } from "@vue/reactivity";
import { updateProp } from "../../props/index.js";

const eventProp = ["onClick"];

/**
 *
 * @param {HTMLElement} el
 * @param {string} name
 * @param {function} fn
 */
export function createEffectAttribute(el, name, fn) {
    if (eventProp.includes(name)) {
        el.addEventListener(name.replace("on", "").toLowerCase(), () => fn());
        return;
    }
    if (el.localName.includes("-")) {
        // 使用异步，避免setProps还未挂载到元素身上
        Promise.resolve().then(() => {
            effect(() => {
                el[updateProp](name, fn())
            })
        })
    } else {
        effect(() => { el.setAttribute(name, fn()) })    
    }
}
