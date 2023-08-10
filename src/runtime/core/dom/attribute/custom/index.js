import { registerCompilerAttribute } from "../../index";

import { vifAttributeHandler } from "./vif";
import { refAttributeHandler } from "./ref";
import { classAttributeHandler } from "./class";

export default function register() {
    registerCompilerAttribute(vifAttributeHandler);
    registerCompilerAttribute(refAttributeHandler);
    registerCompilerAttribute(classAttributeHandler);
}
