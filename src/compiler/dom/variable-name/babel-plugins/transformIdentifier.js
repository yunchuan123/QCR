import { setPrefix } from "../index.js";

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
                if (path.node.object.type === "Identifier") {
                    path.node.object.name = setPrefix(path.node.object.name);
                }
            }
        }
    };
};




