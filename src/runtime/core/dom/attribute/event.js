export function processEventAttribute(el, key, value) {
    const eventName = key.replace("@", "");
    // 如果el身上有$listen证明它是自定义函数，就可以通过$listen去监听
    if (el.$listen) {
        el.$listen(eventName, value);
    } else { // 代表是原生元素
        el.addEventListener(eventName, value);
    }
}
