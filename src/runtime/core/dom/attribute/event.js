export function createEventAttribute(el, key, value) {
    const eventName = key.replace("@", "");
    if (el.$listen) {
        el.$listen(eventName, value);
    } else {
        el.addEventListener(eventName, value);
    }
}