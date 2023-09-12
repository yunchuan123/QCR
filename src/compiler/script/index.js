import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import "../dom/index.js";
import babel from "@babel/core";
import { trimString } from "../../utils/string-utils.js";
import log from "../../utils/log.js";
import { hasVarName } from "../utils/export-variable-utils.js";

/**
 * 推送变量名到数组中
 * @param {string[]} arr
 * @param {string} varName
 */
function pushVarNamrToArr(arr, varName) {
    if (arr.includes(varName)) {
        log.error("请勿在文件中定义重复的变量名");
    } else if (hasVarName(varName)){ // 确认变量是需要导出的变量， tree-shaking优化
        arr.push(varName);
    }
}

/**
 * 解析出顶层的所有变量并导出
 * @param {string} code
 * @returns
 */
export function parseScriptVariables(code) {
    const ast = parse(code, { sourceType: "module" });
    const variables = [];
    traverse.default(ast, {
        enter(path) {
            // 导出const、let、var声明的变量
            if (path.isVariableDeclaration()) {
                const declarations = path.node.declarations;
                declarations.forEach((declaration) => {
                    if (declaration.id.type === 'Identifier' && path.parent.type === "Program") {
                        pushVarNamrToArr(variables, declaration.id.name)
                    }
                });
            // 导出function声明的变量
            } else if (path.isFunctionDeclaration()) {
                pushVarNamrToArr(variables, path.node.id.name)
            }
        }
    });

    return variables;
}

/**
 * 处理script标签中的import语句
 * @param {string} code
 * @returns
 */
export function extractImportStatement(code) {
    const ast = parse(code, { sourceType: "module"});
    const imports = [];
    traverse.default(ast, {
        ImportDeclaration(path) {
            const importedVariables = path.node.specifiers.map(specifier => {return { name: specifier.local.name, type: specifier.type }});
            const source = path.node.source.value;
            imports.push({ importedVariables, source });
        }
    });
    return imports;
}


/**
 *  解析script，并return所有顶层变量
 * @param {string} code
 * @returns {string}
 */
export function parseScript(code) {
    const variables = parseScriptVariables(code);
    code = trimString(code);
    if (code.charAt(code.length - 1) !== ";") {
        code += ";"
    }
    code += `\n return {${variables.toString()}};`
    return code;
}
/**
 * 移除原code中的import
 * @param {string} originalCode
 * @returns
 */
export function removeImport(originalCode) {
    const { code: transformedCode } = babel.transformSync(originalCode, {
        ast: true,
        plugins: [
            // 移除 import 语句的插件
            function removeImportsPlugin({ types: t }) {
                return {
                    visitor: {
                        ImportDeclaration(path) {
                            path.remove();
                        },
                    },
                };
            },
        ],
    });
    return transformedCode;
}
