import {parse} from "parse5";
import compilerAttribute, { findFor } from "./attribute-compiler/index.js";
import {isReactiveTemplate, processTemplate, generateEffectStatement} from "./reactive-dom/index.js";
import {setImportPackageSet } from "../sfc/utils/import-packages-utils.js";
import PackageName from "../constant/package-name.js";
import { setCacheVariableName } from "./variable-name/index.js";
import { changeProcessing, getProcessing, PROCESSING_STATE } from "./processing/index.js";
import { setPrefix } from "./variable-name/index.js";

function isStringAllWhitespace(str) {
    return /^\s*$/.test(str);
}

/**
 *  清理html
 * @param {string} code
 * @returns {*}
 */
function clearCode(code) {
    return code.trim()
        .replace(/[\n\r\t]/g, "")
        .replace(/>[\s]+</g, "><");
}

/**
 * 解析code
 * @param {string} code
 * @returns {string}
 */
export default function (code) {
    const node = parse(clearCode(code));
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
            setCacheVariableName(forObject.value.variableName); // 在处理子元素之前，应当把当前元素的for变量压入栈中
            changeProcessing(PROCESSING_STATE.FOR); // 通知程序目前正在处理for循环
            const renderItem = defaultProcess(node);
            return generateForDomStatement(forObject.value, renderItem);
        }
        return defaultProcess(node);
    })
    return `[${childrenStatement.toString()}]`;
}

function defaultProcess(node) {
    let _childrenStatement = "undefined";
    if (node.childNodes?.length > 0) {
        _childrenStatement = processNodeChildren(node.childNodes);
    }
    if (node.nodeName === "#text") {
        if (!node.value || isStringAllWhitespace(node.value)) {
            return undefined;
        } else {
            // 处理模板语法中的响应式变量
            if (isReactiveTemplate(node.value)) {
                const effectProp = processTemplate(node.value);
                if (effectProp.matched) {
                    _childrenStatement = generateEffectStatement(effectProp.value); // 创建副作用函数语句
                    return generateCreateEffectDomStatement(node.nodeName, node.attrs, _childrenStatement);
                }
            }
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
    setImportPackageSet(PackageName.CREATE_DOM);
    setImportPackageSet(PackageName.REACTIVE);
    if (!children) {
        return `{ type: 'defaultDom', renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}); }}`
    }
    return `{ type: 'defaultDom', renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children}); }}`;
}


function generateCreateEffectDomStatement(tagName, attrs, children) {
    setImportPackageSet(PackageName.CREATE_EFFECT_DOM);
    if (getProcessing() === PROCESSING_STATE.FOR) {
        return `{type: 'defaultDom', renderFn: () => { return ${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})}}`
    }
    return `{ type: 'reactiveDom', renderFn: () => { return ${PackageName.CREATE_EFFECT_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})}}`
}

function generateForDomStatement(forObject, children) {
    setImportPackageSet(PackageName.RENDER_LIST);
    return `{ type: 'for', renderFn: (el) => { return ${PackageName.RENDER_LIST}(${setPrefix(forObject.listName)}, (${forObject.variableName}) => { return ${children}}, el, '${forObject.listName}')}} `;
}

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


