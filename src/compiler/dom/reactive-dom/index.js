import ArrayUtils from "../../utils/array-utils.js";

const TEMPLATE_VALUE = /{{\s*(.*?)\s*}}/g;
const TEMPLATE_CONTENT = /{{\s*(.*?)\s*}}/;

const defaultPrefix = "this";

const cacheVariableName = new Set();

export function isReactiveTemplate(content) {
    return TEMPLATE_VALUE.test(content);
}

export function setCacheVariableName(varName) {
    cacheVariableName.add(varName)
}

export function setPrefix(prop, _prefix) {
    const prefix = _prefix || defaultPrefix;
    if (!prop) return "";
    const propParts = prop.split(".");
    if (!cacheVariableName.has(propParts[0])) {
        return `${prefix}.${prop}`;
    } else {
        return prop;
    }
}

/**
 * 解决响应式模板语法
 * @param {string} content
 * @returns {{matched: boolean, value: undefined}|{matched: boolean, value: *}}
 */
export function processTemplate(content) {
    const matched = content.match(TEMPLATE_VALUE);
    if (ArrayUtils.isNotEmpty(matched)) {
        const matches = matched[0].match(TEMPLATE_CONTENT);
        if (ArrayUtils.isNotEmpty(matches)) {
            return {
                matched: true,
                value: matches[1]
            }
        }
    }
    return { matched: false, value: undefined};
}

/**
 * 创建副作用函数
 * @param {string} prop
 * @returns {string}
 */
export function generateEffectStatement(prop) {
    return `(el) => { el.textContent = ${prop}}`
}
