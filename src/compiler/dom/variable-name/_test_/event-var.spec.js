import { replaceVariablesUsingStateMachine } from "../index.js";

test("test event var", () => {
    console.log(replaceVariablesUsingStateMachine("handleClick('1', data.name, data.arr)"));
})
