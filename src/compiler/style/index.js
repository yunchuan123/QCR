import less from "less";
import { minify } from "csso";
import { setCacheMap } from "./cache/index.js";
import { getCurrentFileName } from "../sfc/index.js";
import { isStringAllWhitespace } from "../../utils/string-utils.js";

function generateStyleElement(css) {
    return `() => {const style = document.createElement('style');style.textContent = "${css}";return style;}`;
}

/**
 * 解析less语法
 * @param {string} code
 */
export default async function (code) {
    const result = await less.render(code, { filename: "less", sourceMap: false});
    const css = minify(result.css).css;
    if (!isStringAllWhitespace(css)) {
        setCacheMap(getCurrentFileName(), generateStyleElement(css));
    }
}
