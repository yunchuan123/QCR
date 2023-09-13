/**
 * 是否为自定义的Attribute
 * @param {HTMLElement} el 
 */
export function isCustomELement(el) {
    if (el && el instanceof HTMLElement) {
        return el.localName.includes("-");
    }
    return false;
}