import { registerAttributeCompiler } from "../index.js";

import { clickAttributeHandler } from "./click.js";
import { vifAttributeHandler } from "./vif.js";

export default function register() {
    registerAttributeCompiler(clickAttributeHandler);
    registerAttributeCompiler(vifAttributeHandler);
}
