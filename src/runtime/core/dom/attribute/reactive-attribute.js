import { effect } from "@vue/reactivity";
import { updateProp } from "../../props/index.js";
import { isCustomELement } from "../../../utils/attribute-utils.js";

/**
 * 
 * @param {HTMLElement} el
 * @param {string} name
 * @param {function} fn
 */
export function createReactiveAttribute(el, name, fn) {
    if (isCustomELement(el)) {
        /**
         * 该段逻辑处理的是props 
         */

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
