import { CustomAttribute } from "./custom-attribute.js";
import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";

export const classAttributeHandler = {
    name: CustomAttribute.CLASS,
    handler(attrVo) {
        const {attr} = attrVo;
        return `'${CustomAttribute.CLASS}' : () => { return ${replaceVariablesUsingStateMachine(attr.value)}}`
    }
}