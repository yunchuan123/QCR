import lessParser from "../style/index.js";
import templateParser from "../dom/index.js";
import { parseScript, extractImportStatement, removeImport } from "../script/index.js";
import { generateClassNameByFileName } from "../utils/filename-utils.js";
import { generatePackagesStatement, setImportPackageSet, importArrToString } from "../utils/import-packages-utils.js";
import { trimString } from "../../utils/string-utils.js";
import PackageName from "../constant/package-name.js";
import Log from "../../utils/log.js";


export const styleRegex = /<style\s+lang=['"]?less['"]?>([\s\S]*?)<\/style>/i;
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/i;
const templateRegex = /<template.*?>([\s\S]*?)<\/template>/i;

const PART_TYPE = {
    TEMPLATE: "template",
    SCRIPT: "script",
    STYLE: "style",
    IMPORT: "_import",
    PROPS: "PROPS"
}

// 当前正在处理的文件名
let filename = "";

export function getCurrentFileName() {
    return filename;
}

/**
 * 生成import语句
 * @returns {string} import语句
 */
function generateImportPackagesStatement() {
    setImportPackageSet(PackageName.CAR_RENDER);
    setImportPackageSet(PackageName.CUSTOM_ELEMENT);
    return generatePackagesStatement();
}

/**
 * HTML class generator
 * @param className
 * @param code
 * @returns {Promise<string>}
 */
async function classCodeGenerator(className, code) {
    return `class ${className} extends ${PackageName.CUSTOM_ELEMENT} {  setup() {${code[PART_TYPE.SCRIPT]}} render(ctx) { return ${code[PART_TYPE.TEMPLATE]};} style() { return ${PackageName.STYLE_PACKAGE_NAME}['${filename}']?.() } };`;
}

/**
 * 生成customElement定义语句
 * @param filename
 * @param className
 * @returns {string}
 */
function generateDefineStatement(filename, className) {
    return `window.customElements.define('${filename}', ${className})`
}

/**
 * 生成代码包装
 * @param code
 * @returns {string}
 */
async function generateExportStatement(code) {
    // 生成import语句
    let importStatement = generateImportPackagesStatement();
    importStatement += code[PART_TYPE.IMPORT];
    // 根据文件名创建类名-定义自定义元素
    const className = generateClassNameByFileName(filename);
    const defineStatement = generateDefineStatement(filename, className);
    const content = await classCodeGenerator(className, code);
    return importStatement + content + defineStatement;
}

/**
 *  编译sfc文件
 * @param {string} code
 * @param {string} _filename
 * @returns {*}
 */
export function parse(code, _filename) {
    filename = _filename;
    let parts = {};
    Log.info(`开始编译 ===================================================== ${filename}.vue`)
    // Match and capture the style part
    const styleMatches = styleRegex.exec(code);
    const stylePart = styleMatches ? trimString(styleMatches[1]) : '';
    parts[PART_TYPE.STYLE] = {code: stylePart, type: "style"};

    // Match and capture the script part
    const scriptMatches = scriptRegex.exec(code);
    const scriptPart = scriptMatches ? trimString(scriptMatches[1]) : '';
    parts[PART_TYPE.SCRIPT] = {code: scriptPart, type: "script"};
    // Match and capture the template part
    const templateMatches = templateRegex.exec(code);
    const templatePart = templateMatches ? trimString(templateMatches[1]) : '';
    parts[PART_TYPE.TEMPLATE] = {code: templatePart, type: "template"};
    return baseParser(generateNode(parts));
}

/**
 * SfcNode
 * @param node 三个节点
 * @returns {string} 最终代码
 */
function baseParser(node) {
    const result = { css: "", script: "", template: "", _import: "" };
    Object.keys(PART_TYPE).forEach(key => {
        const part = node.parts[PART_TYPE[key]];
        // 如果没有这部分，则不处理，跳出循环
        if (!part) {
            return;
        }
        // 分别处理javascript、css、html
        switch (PART_TYPE[key]) {
            case PART_TYPE.SCRIPT:
                Log.info(`开始编译 ------ ${filename} ------ javascript`)
                result[PART_TYPE.IMPORT] = importArrToString(extractImportStatement(part.code)); // 先处理script标签中的import语句
                const code = removeImport(part.code); // 删除script标签中的import语句
                result[PART_TYPE.SCRIPT] = parseScript(code); // 开始解析script
                Log.success('编译完成 ------ javascript ------ success')
                break;
            case PART_TYPE.STYLE:
                Log.info(`开始编译 ------ ${filename} ------ style`)
                if (part.code) {
                    lessParser(part.code); // 解析less语法
                }
                Log.success('编译完成 ------ style ------ success')
                break;
            case PART_TYPE.TEMPLATE:
                Log.info(`开始编译 ------ ${filename} ------ template`)
                result[PART_TYPE.TEMPLATE] = templateParser(`<template>${part.code}</template>`); // 开始解析template
                Log.success('开始编译 ------ template ------ success')
                break;
        }
    })
    return constitute(result);
}

/**
 * 组合最终代码
 * @param {{css: string, script: string, template: string}} result
 * @returns {string}
 */
function constitute(result) {
    return generateExportStatement(result);
}

/**
 * 生成node
 * @param parts
 * @returns {{}}
 */
function generateNode(parts = {}) {
    return { parts };
}



