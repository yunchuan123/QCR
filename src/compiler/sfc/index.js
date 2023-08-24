import lessParser from "../style/index.js";
import templateParser from "../dom/index.js";
import { parseScript, extractImportStatement, removeImport } from "../script/index.js";
import { generateClassNameByFileName } from "../utils/filename-utils.js";
import { generatePackagesStatement, setImportPackageSet, importArrToString } from "../utils/import-packages-utils.js";
import PackageName from "../constant/package-name.js";
import Log from "../../utils/log.js";
import { trimString } from "../../utils/string-utils.js";

const styleRegex = /<style.*?>([\s\S]*?)<\/style>/i;
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/i;
const templateRegex = /<template.*?>([\s\S]*?)<\/template>/i;

const PART_TYPE = {
    TEMPLATE: "template",
    SCRIPT: "script",
    STYLE: "style",
    IMPORT: "_import"
}

let filename = "";

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
 * 生成代码包装
 * @param content
 * @returns {string}
 */
async function generateExportStatement(code) {
    // 生成import语句
    let importStatement = generateImportPackagesStatement();
    importStatement += code[PART_TYPE.IMPORT];
    // 根据文件名创建类名-定义自定义元素
    const className = generateClassNameByFileName(filename);
    const defineStatement = `window.customElements.define('${filename}', ${className})`;
    const content = `class ${className} extends ${PackageName.CUSTOM_ELEMENT} {\n setup() {\n${code[PART_TYPE.SCRIPT]}\n}\n render(ctx) { return ${code[PART_TYPE.TEMPLATE]};} \n ${await code[PART_TYPE.STYLE]}\n}; \n`;
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
    Log.info(`开始编译 ===================================================== ${filename}.vue`)
    // Match and capture the style part
    const styleMatches = styleRegex.exec(code);
    const stylePart = styleMatches ? trimString(styleMatches[1]) : '';

    // Match and capture the script part
    const scriptMatches = scriptRegex.exec(code);
    const scriptPart = scriptMatches ? trimString(scriptMatches[1]) : '';

    // Match and capture the template part
    const templateMatches = templateRegex.exec(code);
    const templatePart = templateMatches ? trimString(templateMatches[1]) : '';
    const parts = {
        [PART_TYPE.SCRIPT]: {code: scriptPart, type: "script"},
        [PART_TYPE.STYLE]: {code: stylePart, type: "style"},
        [PART_TYPE.TEMPLATE]: {code: templatePart, type: "template"}
    };
    return baseParser(generateNode(parts));
}


/**
 * 解析sfc后解析出的script、template、style
 * @typedef {Object} SfcNode
 * @property {Part[]} parts
 */


/**
 * SfcNode
 * @param node 三个节点
 * @returns {string} 最终代码
 */
function baseParser(node) {
    const result = { css: "", script: "", template: "", _import: "" };
    Object.keys(PART_TYPE).forEach(key => {
        const part = node.parts[PART_TYPE[key]];
        // 分别处理javascript、css、html
        switch (PART_TYPE[key]) {
            case PART_TYPE.SCRIPT:
                Log.info(`开始编译 ------ ${filename} ------ javascript`)
                result[PART_TYPE.IMPORT] = importArrToString(extractImportStatement(part.code));
                const code = removeImport(part.code);
                result[PART_TYPE.SCRIPT] = parseScript(code);
                Log.success('编译完成 ------ javascript ------ success')
                break;
            case PART_TYPE.STYLE:
                Log.info(`开始编译 ------ ${filename} ------ style`)
                result[PART_TYPE.STYLE] = lessParser(part.code);
                Log.success('编译完成 ------ style ------ success')
                break;
            case PART_TYPE.TEMPLATE:
                Log.info(`开始编译 ------ ${filename} ------ template`)
                result[PART_TYPE.TEMPLATE] = templateParser(`<template>${part.code}</template>`);
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

function generateNode(parts = {}) {
    const node = {};
    node.parts = parts;
    return node;
}



