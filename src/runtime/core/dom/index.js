import TagName from "./constant/tag-name.js";
import {effect} from "@vue/reactivity";
import { createReactiveAttribute } from "./attribute/reactive-attribute.js";
import register from "./attribute/custom/index.js";
import { processEvent, processNativeEvent } from "./attribute/event.js";

const compilerAttribute = {};

export function registerCompilerAttribute(attributeHandler) {
    compilerAttribute[attributeHandler.name] = attributeHandler;
}

register(); // 注册所有attribute处理器


function processAttribute(el, attr) {
    const keys = Object.keys(attr);
    if (Array.isArray(keys) && keys.length > 0) {
        keys.forEach(key => {
            const value = attr[key];
            const params = { el, value };
           if (isCarEvent(key)) {
                // 处理事件绑定
                processEvent(el, key, value);
            } else if (isNativeEvent(key)) {
                processNativeEvent(el, key, value);
            } else if (compilerAttribute[key]) {
                const compiler = compilerAttribute[key];
                compiler.handler(params);
            } else if (typeof value === "function") {
                if (key.startsWith(":")) {
                    // 处理响应式属性
                    // 创建响应式attribute（如果属性以:开头证明为响应式属性）
                    createReactiveAttribute(el, key, value);
                } else {
                    el.setAttribute(key, value());
                }
            } else {
                // 处理普通类型的 attribute
                el.setAttribute(key, value);
            }
        });
    }
}

/**
 *
 * @param {string} tagName
 * @param {{[key:string], [value: string]}} attr
 * @param {[HTMLElement]}children
 */
export function createDom(tagName, attr, children) {
    if (tagName === TagName.TEXT) {
        return document.createTextNode(children)
    }
    const el = document.createElement(tagName);
    processAttribute(el, attr);
    // 开始清理children
    if (Array.isArray(children)) {
        children.forEach((element) => {
            if (!element) {
                return;
            }
            switch (element.type) {
                case "defaultDom":
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

/**
 * 判断是否为事件
 * @param {string} name
 * @returns
 */
function isCarEvent(name) {
    return name.startsWith("@");
}

function isNativeEvent(name) {
    return name.startsWith("on")
}


export { renderList } from "./attribute/render-for.js";
export { useRefs } from "./attribute/custom/ref.js";
