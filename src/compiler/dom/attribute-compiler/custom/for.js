import ArrayUtils from "../../../utils/array-utils.js";
import { CustomAttribute } from "../../../../constant/attribute-name.js";

export function extractVariables(code) {
    if (!code.includes(" in ")) { throw new Error("请检查v-for语法是否正确"); }
    const matches = code.split(" in ");
    if (ArrayUtils.isNotEmpty(matches)) {
        const variableName = matches[0].trim();
        const listName = matches[1].trim();
        if (variableName.includes("(")) {
            return { variableName: variableName.replace(/\(|\)/g, "").trim(), listName: listName.trim() };
        }
        return { variableName: variableName.trim(), listName: listName.trim() };
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
