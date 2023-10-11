import { registerCompilerAttribute } from "../../index";

import { vifAttributeHandler } from "./vif";
import { refAttributeHandler } from "./ref";
import { classAttributeHandler } from "./class";

export const compilerAttribute = {};

export function registerCompilerAttribute(attributeHandler) {
    compilerAttribute[attributeHandler.name] = attributeHandler;
}

export default function register() {
    registerCompilerAttribute(vifAttributeHandler); // 处理v-if
    registerCompilerAttribute(refAttributeHandler); // 处理ref
    registerCompilerAttribute(classAttributeHandler); // 处理class
}

register(); // 注册所有attribute处理器