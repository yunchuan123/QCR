import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function parseScriptVariables(code) {
    const ast = parse(code);
    const variables = [];

    traverse.default(ast, {
        enter(path) {
            if (path.isVariableDeclaration()) {
                const declarations = path.node.declarations;
                declarations.forEach((declaration) => {
                    if (declaration.id.type === 'Identifier') {
                        variables.push(declaration.id.name);
                    }
                });
            }
        }
    });

    return variables;
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
