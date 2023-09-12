/**
 * 处理event，以“@”开头的事件监听
 * @param {HTMLElement} el 
 * @param {string} key 
 * @param {Function} value 
 */
export function processEvent(el, key, value) {
    const eventName = key.replace("@", "");
    // 如果el身上有$listen证明它是自定义函数，就可以通过$listen去监听
    if (el.$listen) {
        el.$listen(eventName, value);
    } else { // 代表是原生元素
        el.addEventListener(eventName, value);
    }
}

/**
 * 处理原生的事件
 * @param {HTMLElement} el 
 * @param {string} key 
 * @param {function} value 
 */
export function processNativeEvent(el, key, value) {
    const eventName = key.replace("on", "").toLowerCase();
    el.addEventListener(eventName, value);
}