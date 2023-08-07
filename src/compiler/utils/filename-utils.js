/**
 *
 * @param {string} str
 * @returns {*}
 */
export function kebabToPascalCase(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

const filenameRegex = /\/([^/]+)\.vue$/;

/**
 *
 * @param {string} path
 * @returns {*}
 */
export function getNameByPath(path) {
    const match = path.match(filenameRegex);
    return match[1];
}
