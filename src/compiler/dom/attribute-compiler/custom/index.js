import { registerAttributeCompiler } from "../index.js";

import { clickAttributeHandler } from "./click.js";
import { vifAttributeHandler } from "./vif.js";
import { classAttributeHandler } from "./class.js";

export default function register() {
    registerAttributeCompiler(clickAttributeHandler);
    registerAttributeCompiler(vifAttributeHandler);
    registerAttributeCompiler(classAttributeHandler);
}
