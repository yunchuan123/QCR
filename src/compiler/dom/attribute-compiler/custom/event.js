import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";
import { setPrefix } from "../../variable-name/index.js";

export function processEventHandler(attrVo) {
    const { attr } = attrVo;
    if (attr.value.includes("(")) {
        return `'${attr.name}': () => ${replaceVariablesUsingStateMachine(attr.value)}`;
    } else {
        return `'${attr.name}': ${setPrefix(attr.value)}`;
    }
}