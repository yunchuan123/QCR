const trim = String.prototype.trim;

export function trimString(content) {
    if (!content) {
        return "";
    }
    return trim.call(content);
}

/**
 * 判断字符串是不是空字符（空格也算）
 * @param {string} str
 * @returns
 */
export function isStringAllWhitespace(str) {
    if(!str) {
        return true;
    }
    return /^\s*$/.test(str);
}


/**
 * 提取出中间的内容
 * @param {string} code
 * @param {string} start
 * @param {string} end
 */
export function extractContent(code, start = "{", end = "}") {
    let charArr = code.split("");
    for (let i = 0; i < charArr.length; i++) {
        if (charArr[i] === start) {
            charArr = charArr.slice(i + 1);
            break;
        }
    }
    for (let i = charArr.length - 1; i > 0; i++) {
        if (charArr[i] === end) {
            charArr = charArr.slice(0, i - 1);
            break;
        }
    }
    return charArr.join("");
}
