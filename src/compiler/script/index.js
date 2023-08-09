import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import "../dom/index.js";
import babel from "@babel/core"

export function parseScriptVariables(code) {
    const ast = parse(code, { sourceType: "module" });
    const variables = [];
    traverse.default(ast, {
        enter(path) {
            if (path.isVariableDeclaration()) {
                const declarations = path.node.declarations;
                declarations.forEach((declaration) => {
                    if (declaration.id.type === 'Identifier' && path.parent.type === "Program") {
                        variables.push(declaration.id.name);
                    }
                });
            }
        }
    });

    return variables;
}

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
 *  解析script
 * @param {string} code
 * @returns {string}
 */
export function parseScript(code) {
    const variables = parseScriptVariables(code);
    code = code.trim();
    if (code.charAt(code.length - 1) !== ";") {
        code += ";"
    }
    code += `\n return {${variables.toString()}};`
    return code;
}

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
