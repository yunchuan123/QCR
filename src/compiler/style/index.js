import less from "less";
import { minify } from "csso";

function generateStyleElement(css) {
    return `style() {const style = document.createElement('style');style.textContent = "${css}";return style;}`;
}

/**
 * 解析less语法
 * @param {string} code
 */
export default async function (code) {
    const result = await less.render(code, { filename: "less", sourceMap: false});
    const css = minify(result.css).css;
    return generateStyleElement(css);
}
