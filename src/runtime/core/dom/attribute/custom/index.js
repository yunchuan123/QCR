import { registerCompilerAttribute } from "../../index";

import { vifAttributeHandler } from "./vif";

export default function register() {
    registerCompilerAttribute(vifAttributeHandler);
}
