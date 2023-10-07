import {createFilter} from "rollup-pluginutils";
import {readFileSync} from "fs";
import {parse} from "./sfc/index.js";
import {getNameByPath} from "./utils/filename-utils.js";
import {getCacheMap} from "./style/cache/index.js";

function styleCodeWrapper(code) {
    return `const styleMapping = {${code}};\n`;
}

function generateStyle() {
    const styleCache = getCacheMap();
    let styleCodeArr = [];
    styleCache.forEach((value, key) => {
        styleCodeArr.push(`'${key}': ${value}`);
    });
    return styleCodeWrapper(styleCodeArr.join(",\n"));
}

function combinCode(code) {
    return generateStyle() + code;
}

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
                map: {mappings: ""},
            };
        },
        generateBundle(_, bundle) {
            const {code} = bundle["bundle.js"];
            bundle["bundle.js"] = {
                code: combinCode(code),
                fileName: "bundle.js",
                isEntry: true,
            };
        },
    };
}
