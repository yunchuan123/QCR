import {parse} from "parse5";
import compilerAttribute from "./compiler-attribute.js";
import {isReactiveTemplate, processTemplate, generateEffectStatement, setPrefix} from "./reactive-dom/index.js";
import { hasImport, setImportPackageSet } from "../sfc/utils/import-packages-utils.js";
import PackageName from "../constant/package-name.js";

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
                        _childrenStatement = generateEffectStatement(setPrefix(effectProp.value));
                        return generateCreateEffectDomStatement(node.nodeName, node.attrs, _childrenStatement);
                    }

                }
                _childrenStatement = `'${node.value}'`
            }
        }
        return generateCreateDomStatement(node.nodeName, node.attrs, _childrenStatement)
    })
    return `[${childrenStatement.toString()}]`;
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
        return `${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)})`
    }
    return `${PackageName.CREATE_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})`
}


function generateCreateEffectDomStatement(tagName, attrs, children) {
    setImportPackageSet(PackageName.CREATE_EFFECT_DOM)
    return `${PackageName.CREATE_EFFECT_DOM}('${tagName}', ${compilerAttribute(attrs)}, ${children})`
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


