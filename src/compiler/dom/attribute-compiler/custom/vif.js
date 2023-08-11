import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";
import { CustomAttribute } from "../../../../constant/attribute-name.js";

export const vifAttributeHandler = {
    name: CustomAttribute.IF,
    handler(attrVo) {
        const { attr } = attrVo;
        const conditional = replaceVariablesUsingStateMachine(attr.value);
        return `'${CustomAttribute.IF}': () => ${conditional}`;
    }
}