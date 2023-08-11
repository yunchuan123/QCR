const trim = String.prototype.trim;

export function trimString(content) {
    console.log(content);
    if (!content) {
        return "";
    }
    return trim.call(content);
}