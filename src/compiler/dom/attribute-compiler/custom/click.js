import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";
import { setPrefix } from "../../variable-name/index.js";
import { CustomAttribute } from "./custom-attribute.js";

export function processClickAttribute(content) {
    if (content.includes("(")) {
        return `onClick: () => ${replaceVariablesUsingStateMachine(content)}`;
    } else {
        return `onClick: ${setPrefix(content)}`;
    }
}

export const clickAttributeHandler = {
    name: CustomAttribute.CLICK,
    handler(attrVo) {
        const { attr } = attrVo;
        return processClickAttribute(attr.value);
    }
}
