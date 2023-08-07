import { basename } from "path";
/**
 *
 * @param {string} str
 * @returns {*}
 */
export function kebabToPascalCase(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 *
 * @param {string} path
 * @returns {*}
 */
export function getNameByPath(path) {
    const name = basename(path)
    if (!name) {
        throw new Error("未能匹配到文件名")
    }
    const match = name.split(".");
    return match[0];
}
