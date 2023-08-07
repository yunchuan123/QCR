import { setPrefix } from "./reactive-dom/index.js";

/**
 *  将attributes转换为json
 * @param {{name: string, value: string}[]} attributes
 */
export default function (attributes = []) {
    let objContent = "";
    attributes.forEach((item) => {
        if (isReactiveAttribute(item.name)) {
            objContent += generateEffectStatement(item)
        } else {
            objContent += `${item.name}: '${item.value}',`
        }
    });
    objContent = objContent.slice(0, -1);
    return `{${objContent}}`;
}

/**
 *  确认是否为响应式属性
 * @param {string} attr
 * @returns {boolean}
 */
function isReactiveAttribute(attr) {
    return attr.startsWith(":");
}

function generateEffectStatement(attr) {
    return `${attr.name.replace(":", "")}: () => { return ${setPrefix(attr.value)}},`
}
