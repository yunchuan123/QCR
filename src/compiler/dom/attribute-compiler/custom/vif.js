import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";
import { CustomAttribute } from "./custom-attribute.js";

export const vifAttributeHandler = {
    name: CustomAttribute.IF,
    handler(attrVo) {
        const { attr } = attrVo;
        const conditional = replaceVariablesUsingStateMachine(attr.value);
        return `'${CustomAttribute.IF}': () => ${conditional}`;
    }
}