import {parse} from "parse5";
import compilerAttribute, { findFor } from "./attribute-compiler/index.js";
import {isReactiveTemplate, processTemplate, generateEffectStatement} from "./reactive-dom/index.js";
import {setImportPackageSet } from "../utils/import-packages-utils.js";
import PackageName from "../constant/package-name.js";
import { removeCacheVariable, setCacheVariableName } from "./variable-name/index.js";
import { changeProcessing, getProcessing, PROCESSING_STATE, resetProcessing } from "./processing/index.js";
import { setPrefix } from "./variable-name/index.js";
import { trimString } from "../../utils/string-utils.js";
import log from "../../utils/log.js";
import { DOM_TYPE } from "../constant/dom-type.js";

/**
 * 判断字符串是不是空字符（空格也算）
 * @param {string} str
 * @returns
 */
function isStringAllWhitespace(str) {
    if(!str) {
        return true;
    }
    return /^\s*$/.test(str);
}

/**
 *  清理html
 * @param {string} code
 * @returns {*}
 */
function clearCode(code) {
    return trimString(code)
        .replace(/[\n\r\t]/g, "")
        .replace(/>[\s]+</g, "><");
}

/**
 * 找到根节点
 * @param {*} node
 * @returns
 */
function traverse(node) {
    if (node.nodeName === "template") {
        return node.content.childNodes[0];
    }
    if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const result = traverse(node.childNodes[i]);
            if (result) {
                return result;
            }
        }
    }
}


/**
 * 解析code
 * @param {string} code
 * @returns {string}
 */
export default function (code) {
    const node = parse(clearCode(code));
    if (!node) {
        log.error("没有找到根节点")
    }
    const rootNode = traverse(node);
    return processNode(rootNode);
}

/**
 *  创建根节点
 * @param {HTMLElement} node
 */
function processNode(node) {
    return generateCreateDomStatement(node.nodeName, node.attrs, processNodeChildren(node.childNodes));
}

/**
 *  循环处理node
 * @param {HTMLElement[]} nodes
 */
function processNodeChildren(nodes = []) {
    const childrenStatement = nodes.map(node => {
        if (!node.attrs) {
            return defaultProcess(node);
        }
        const forObject = findFor(node.attrs);
        if (forObject.found) {
            let variableNames;
            // 如果是多个变量，例如：(item, index) in list
            if (forObject.value.variableName.includes(",")) {
                variableNames = forObject.value.variableName.split(",").map(item => trimString(item));
            } else {
                variableNames = [trimString(forObject.value.variableName)];
            }
            // 将变量名加入到缓存中
            variableNames.forEach(variableName => {
                setCacheVariableName(trimString(variableName));
            })
            // 通知程序目前正在处理for循环
            changeProcessing(PROCESSING_STATE.FOR);
            const renderItem = defaultProcess(node);
            // 结束for循环状态
            resetProcessing();
            // 将变量名从缓存中移除
            variableNames.forEach(variableName => {
                removeCacheVariable(trimString(variableName));
            });
            return generateForDomStatement(forObject.value, renderItem);
        }
        return defaultProcess(node);
    })
    return `[${ childrenStatement.toString() }]`;
}

/**
 * 默认的处理函数
 * @param {HTMLElement} node
 * @returns
 */
function defaultProcess(node) {
    // 删除注释节点
    if (node.nodeName === "#comment") {
        return undefined;
    }
    let _childrenStatement = "undefined";
    if (node.childNodes?.length > 0) {
        _childrenStatement = processNodeChildren(node.childNodes);
    }
    if (node.nodeName === "#text") {
        // 处理空白文本
        if (isStringAllWhitespace(node.value)) {
            return undefined;
        } else {
            // 处理模板语法中的响应式变量
            if (isReactiveTemplate(node.value)) {
                const effectProp = processTemplate(node.value);
                if (effectProp.matched) {
                    // 创建副作用函数语句
                    return generateCreateEffectDomStatement(node.nodeName, node.attrs, generateEffectStatement(effectProp.value));
                }
            }
            // 非响应式变量
            _childrenStatement = `'${node.value}'`;
        }
    }
    return generateCreateDomStatement(node.nodeName, node.attrs, _childrenStatement);
}

/**
 *  生成创建dom元素的语句
 * @param {string} tagName
 * @param {{[key:string]: [value: string]}[]} attrs
 * @param {string}children
 */
function generateCreateDomStatement(tagName, attrs, children) {
    setImportPackageSet(PackageName.CREATE_DOM); // 设置要引入的包
    if (!children) {
        return `{ type: ${DOM_TYPE.DEFAULT_DOM}, renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}); }}`
    }
    return `{ type: ${DOM_TYPE.DEFAULT_DOM}, renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children}); }}`;
}

/**
 * 生成创建副作用dom元素的语句
 * @param {string} tagName
 * @param {string} attrs
 * @param {string} children
 * @returns
 */
function generateCreateEffectDomStatement(tagName, attrs, children) {
    setImportPackageSet(PackageName.CREATE_EFFECT_DOM); // 设置要引入的包
    if (getProcessing() === PROCESSING_STATE.FOR) {
        return `{type: ${DOM_TYPE.DEFAULT_DOM}, renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})}}`
    }
    return `{ type: ${DOM_TYPE.REACTIVE_DOM}, renderFn: () => { return ${PackageName.CREATE_EFFECT_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})}}`
}

/**
 * 生成for循环语句
 * @param {{listName: string, variableName: string}} forObject
 * @param {string} children
 * @returns { string } for statement
 */
function generateForDomStatement(forObject, children) {
    setImportPackageSet(PackageName.RENDER_LIST); // 设置要引入的包
    return `{ type: ${DOM_TYPE.FOR}, renderFn: (el) => { return ${PackageName.RENDER_LIST}(${setPrefix(forObject.listName)}, (${forObject.variableName}) => { return ${children}}, el, '${forObject.listName}')}} `;
}

