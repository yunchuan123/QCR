import ArrayUtils from "../../../utils/array-utils.js";
import { CustomAttribute } from "../../../../constant/attribute-name.js";
import { trimString } from "../../../../utils/string-utils.js";

export function extractVariables(code) {
    if (!code.includes(" in ")) { throw new Error("请检查v-for语法是否正确"); }
    const matches = code.split(" in ");
    if (ArrayUtils.isNotEmpty(matches)) {
        const variableName = trimString(matches[0]);
        const listName = trimString(matches[1]);
        if (variableName.includes("(")) {
            return { variableName: trimString(variableName.replace(/\(|\)/g, "")), listName: trimString(listName) };
        }
        return { variableName: trimString(variableName), listName: trimString(listName) };
    } else {
        throw new Error("There is an error in the configuration of the v-for attribute");
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
