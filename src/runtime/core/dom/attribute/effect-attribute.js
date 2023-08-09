import { effect } from "@vue/reactivity";

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
    effect(() => { el.setAttribute(name, fn()) })
}
