import { replaceVariablesUsingStateMachine } from "../../variable-name/index.js";
import { setPrefix } from "../../variable-name/index.js";

export function processClickAttribute(content) {
    if (content.includes("(")) {
        return `onClick: () => ${replaceVariablesUsingStateMachine(content)}`;
    } else {
        return `onClick: ${setPrefix(content)}`;
    }
}
