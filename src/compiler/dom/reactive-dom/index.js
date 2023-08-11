import ArrayUtils from "../../../utils/array-utils.js";
import { getProcessing, PROCESSING_STATE } from "../processing/index.js";
import { setImportPackageSet } from "../../utils/import-packages-utils.js";
import PackageName from "../../constant/package-name.js";
import { setPrefix, variableInCache } from "../variable-name/index.js";

const TEMPLATE_VALUE = /{{\s*(.*?)\s*}}/g;
const TEMPLATE_CONTENT = /{{\s*(.*?)\s*}}/;

/**
 * 确认元素是否为响应式模板
 * @param {string} content 
 * @returns 
 */
export function isReactiveTemplate(content) {
    return TEMPLATE_VALUE.test(content);
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
    setImportPackageSet(PackageName.TO_DISPLAY_STRING);
    // 如果当前是在处理for循环 应当采用不同的编译方式
    if (getProcessing() === PROCESSING_STATE.FOR && variableInCache(prop)) {
        return `${PackageName.TO_DISPLAY_STRING}(${prop})`;
    }
    return `(el) => { el.textContent = ${PackageName.TO_DISPLAY_STRING}(${setPrefix(prop)})}`
}
