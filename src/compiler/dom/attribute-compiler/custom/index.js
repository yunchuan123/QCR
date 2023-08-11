import { registerAttributeCompiler } from "../index.js";

import { vifAttributeHandler } from "./vif.js";
import { classAttributeHandler } from "./class.js";

export default function register() {
    registerAttributeCompiler(vifAttributeHandler);
    registerAttributeCompiler(classAttributeHandler);
}
