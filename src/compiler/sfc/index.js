import lessParser from "../style/index.js";
import templateParser from "../dom/index.js";
import { parseScript } from "../script/index.js";
import { kebabToPascalCase } from "../utils/filename-utils.js";
import { generatePackagesStatement } from "./utils/import-packages-utils.js";

const styleRegex = /<style.*?>([\s\S]*?)<\/style>/i;
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/i;
const templateRegex = /<template.*?>([\s\S]*?)<\/template>/i;

const PART_TYPE = {
    TEMPLATE: "template",
    SCRIPT: "script",
    STYLE: "style"
}

let filename = "";

function generateConstructorStatement() {
    return "constructor() {\n" +
        "        super();\n" +
        "        const varibles = this.setup();\n" +
        "        Object.assign(this, varibles);\n" +
        "        const element = this.render(this);\n" +
        "        const shadowRoot = this.attachShadow({ mode: \"open\"});\n" +
        "        this.style && shadowRoot.appendChild(this.style());\n" +
        "        shadowRoot.appendChild(element);\n" +
        "    }\n"
}

/**
 * 生成代码包装
 * @param content
 * @returns {string}
 */
async function generateExportStatement(code) {
    const importStatement = generatePackagesStatement();
    const className = kebabToPascalCase(filename);
    const defineStatement = `window.customElements.define('${filename}', ${className})`;
    console.log(await code[PART_TYPE.STYLE]);
    const content = `class ${className} extends HTMLElement {\n ${generateConstructorStatement()} setup() {\n${code[PART_TYPE.SCRIPT]}\n}\n render(ctx) { return ${code[PART_TYPE.TEMPLATE]};} \n ${await code[PART_TYPE.STYLE]}\n}; \n`;
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
    // Match and capture the style part
    const styleMatches = styleRegex.exec(code);
    const stylePart = styleMatches ? styleMatches[1].trim() : '';

    // Match and capture the script part
    const scriptMatches = scriptRegex.exec(code);
    const scriptPart = scriptMatches ? scriptMatches[1].trim() : '';

    // Match and capture the template part
    const templateMatches = templateRegex.exec(code);
    const templatePart = templateMatches ? templateMatches[1].trim() : '';
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
 * @param node
 * @returns {string}
 */
function baseParser(node) {
    const result = { css: "", script: "", template: ""};
    Object.keys(PART_TYPE).forEach(key => {
        const part = node.parts[PART_TYPE[key]];
        switch (PART_TYPE[key]) {
            case PART_TYPE.SCRIPT:
                result[PART_TYPE.SCRIPT] = parseScript(part.code);
                break;
            case PART_TYPE.STYLE:
                result[PART_TYPE.STYLE] = lessParser(part.code);
                break;
            case PART_TYPE.TEMPLATE:
                result[PART_TYPE.TEMPLATE] = templateParser(`<template>${part.code}</template>`);
                break;
        }
    })
    return constitute(result);
}

/**
 *
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



