import babel from "@babel/core";
import { transformIdentifier } from "./babel-plugins/transformIdentifier.js";
import log from "../../../utils/log.js";
import { trimString } from "../../../utils/string-utils.js";

/**
 * 缓存变量名
 * 例如for循环中的变量名 (item in list)
 * 在循环中item是可用的，所以需要缓存起来，防止item变量被加上前缀
 */
const cacheVariableName = new Set();

const defaultPrefix = "ctx";

/**
 * 设置缓存变量名
 * @param varName
 */
export function setCacheVariableName(varName) {
    if (cacheVariableNameHas(varName)) {
        log.error(`变量${varName}已经存在, 请检查模板`);
    }
    cacheVariableName.add(varName)
}

/**
 * 删除缓存变量
 * @param varName
 */
export function removeCacheVariable(varName) {
    cacheVariableName.delete(varName);
}

/**
 * 变量名是否在缓存中
 * @param varName
 * @returns {boolean}
 */
export function cacheVariableNameHas(varName) {
    return cacheVariableName.has(varName);
}

/**
 * 为变量加上前缀
 * @param {string} prop
 * @param {string} _prefix
 * @returns
 */
export function setPrefix(prop, _prefix) {
    const prefix = _prefix || defaultPrefix;
    if (!variableInCache(prop)) {
        return `${prefix}.${prop}`;
    } else {
        return prop;
    }
}

/**
 * 变量是否在缓存中（包含拆分prop的功能，例如obj.name 会将obj拆分出来）
 * @param {string} prop
 * @returns {boolean|string}
 */
export function variableInCache(prop) {
    if (!prop) return "";
    const propParts = prop.split(".");
    return cacheVariableNameHas(propParts[0]);
}

/**
 * 为语句中需要加前缀的变量加上前缀
 * @param {string} expression
 * @returns
 */
export function replaceVariablesUsingStateMachine(expression) {
    expression = trimString(expression);
    const transformedCode = babel.transform(expression, {
        plugins: [transformIdentifier],
        generatorOpts: {
            retainLines: true
        }
    });
    return transformedCode.code.slice(0, -1)
}

