import TagName from "./constant/tag-name.js";
import {effect} from "@vue/reactivity";
import { createEffectAttribute } from "./attribute/effect-attribute.js";
import register from "./attribute/custom/index.js";

/**
 * 解析sfc后解析出的script、template、style
 * @typedef {Object} SfcNode
 * @property {Part[]} parts
 */


const compilerAttribute = {};

export function registerCompilerAttribute(attributeHandler) {
    compilerAttribute[attributeHandler.name] = attributeHandler;
}

register(); // 注册所有处理器

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
        const value = attr[key];
        const params = { el, value }
        if (compilerAttribute[key]) {
            const compiler = compilerAttribute[key];
            compiler.handler(params);
        }
        // 创建响应式attribute
        if (typeof value === "function") {
            createEffectAttribute(el, key, value);
        } else {
            el.setAttribute(key, value);
        }
    });
    // 开始清理children
    if (Array.isArray(children)) {
        children.forEach((element) => {
            switch (element.type) {
                case "defaultDom":
                    el.appendChild(element.renderFn());
                    break;
                case "reactiveDom":
                    el.appendChild(element.renderFn());
                    break;
                case "for":
                    element.renderFn(el);
                    break;
            }
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


export { renderList } from "./attribute/render-for.js";
export { useRefs } from "./attribute/custom/ref.js";
