import { setPrefix } from "../index.js";
import babel from "@babel/core";

/**
 * babel插件 编译 :class 文件
 * @returns {{visitor: {Identifier(*): void}}}
 */
export function transformIdentifier() {
    return {
        visitor: {
            Identifier(path) {
                const identifierName = path.node.name;
                if (["CallExpression", "BinaryExpression"].includes(path.container.type)) {
                    path.node.name = setPrefix(identifierName);
                }
            },
            MemberExpression(path) {
                console.log(path.node);
                if (path.node.object.type === "Identifier") {
                    path.node.object.name = setPrefix(path.node.object.name);
                }
            }
        }
    };
};




