import {createFilter} from "rollup-pluginutils";
import { readFileSync } from "fs";
import { parse } from "./sfc/index.js";
import { getNameByPath } from "./utils/filename-utils.js";


/**
 * rollup plugin
 * @param {Object} options
 */
export function loader(options) {
    const filter = createFilter(options.include, options.exclude);
    return {
        name: "vue",
        /**
         *  load function
         * @param {string} filename
         */
        async load(filename) {
            if (!filter(filename) || !filename.match(/\.(vue)$/)) {
                return null;
            }
            let code = readFileSync(filename).toString();
            code = await parse(code, getNameByPath(filename));
            return {
                code,
                map: { mappings: "" }
            }
        }
    }
}
