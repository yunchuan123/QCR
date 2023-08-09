import { setPrefix } from "../variable-name/index.js";
import { CustomAttributeArr, CustomAttribute } from "./custom/custom-attribute.js";
import {getProcessing, PROCESSING_STATE} from "../processing/index.js";

/**
 *  将attributes转换为json
 * @param {{name: string, value: string}[]} attributes
 */
export default function (attributes = []) {
    let objContent = "";
    attributes.forEach((item) => {
        if (getProcessing() === PROCESSING_STATE.FOR && ["ref", ":ref"].includes(item.name)) {
            throw new Error("请勿将ref定义在b-for子元素上");
        }
        if (CustomAttributeArr.includes(item.name)) {
            switch (item.name) {
                case CustomAttribute.CLICK:
                    objContent += `onClick: ${setPrefix(item.value)},`;
                    break;
            }
            return;
        }
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


export { CustomAttribute } from "./custom/custom-attribute.js";
export { findFor } from "./custom/for.js";
