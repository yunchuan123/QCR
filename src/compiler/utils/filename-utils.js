import { basename } from "path";
/**
 * 通过文件名创建类名
 * @param {string} str
 * @returns {*}
 */
export function generateClassNameByFileName(str) {
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
