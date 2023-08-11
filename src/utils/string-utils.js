const trim = String.prototype.trim;

export function trimString(content) {
    if (!content) {
        return "";
    }
    return trim.call(content);
}