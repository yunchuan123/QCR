import ArrayUtils from "../../../utils/array-utils.js";
import { CustomAttribute } from "./custom-attribute.js";

const  FOR_EXPRESSION = /(\w+)\sin\s((?:\w+\.?)+)/;

export function extractVariables(code) {
    const matches = code.match(FOR_EXPRESSION);
    if (ArrayUtils.isNotEmpty(matches)) {
        const variableName = matches[1];
        const listName = matches[2];
        return { variableName, listName };
    } else {
        throw new Error("There is an error in the configuration of the b-for attribute");
    }
}


/**
 *  找到for属性
 * @param {[]} attrs
 */
export function findFor(attrs) {
    const attr = attrs.find(item => item.name === CustomAttribute.FOR);
    if (attr) {
        const forObj = extractVariables(attr.value);
        return { found: true, value: forObj };
    }
    return { found: false, value: true};
}
