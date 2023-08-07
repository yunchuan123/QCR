import TagName from "./constant/tag-name.js";
import {effect} from "@vue/reactivity";

/**
 * 解析sfc后解析出的script、template、style
 * @typedef {Object} SfcNode
 * @property {Part[]} parts
 */


/**
 *
 * @param {string} tagName
 * @param {{[key:string], [value: string]}} attr
 * @param {[HTMLElement]}children
 */
export function createDom(tagName, attr, children) {
    if (tagName === TagName.TEXT) { return document.createTextNode(children) };
    const el = document.createElement(tagName);
    Object.keys(attr).forEach(key => {
        if (typeof attr[key] === "function") {
            createEffectAttribute(el, key, attr[key]);
        } else {
            el.setAttribute(key, attr[key]);
        }
    });
    if (Array.isArray(children)) {
        children.forEach(element => {
            el.appendChild(element);
        });
    }
    return el;
}

/**
 * 生成副作用响应式变量
 * @param {string} tagName
 * @param {{[key:string], [value: string]}} attr
 * @param {function}children
 */
export function createEffectDom(tagName, attr, children ) {
    const el = createDom(tagName, attr, children);
    effect(() => { children(el) });
    return el;
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} name
 * @param {function} fn
 */
export function createEffectAttribute(el, name, fn) {
    effect(() => { el.setAttribute(name, fn()) })
}
