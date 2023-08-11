import { CustomAttribute } from "../../../../constant/attribute-name.js";
import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";

/**
 * 处理class属性
 */

export const classAttributeHandler = {
    name: CustomAttribute.CLASS,
    handler(attrVo) {
        const {attr} = attrVo;
        return `'${CustomAttribute.CLASS}' : () => { return ${replaceVariablesUsingStateMachine(attr.value)}}`
    }
}