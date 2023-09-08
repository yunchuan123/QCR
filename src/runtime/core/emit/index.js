const defaultEventOptions = {
    bubbles: true,  // 事件会冒泡
    composed: true, // 事件可以穿越shadow DOM边界
    detail: { data: undefined }
}

/**
 *  增加事件emit方法
 * @param {string} name
 * @param {any} value
 * @param {object} options
 */
HTMLElement.prototype.$emit = function(name, value, options = {}) {
    const _options = Object.assign(defaultEventOptions, options);
    _options.detail.data = value;
    const event = new CustomEvent(name.toLowerCase(), _options);
    this.dispatchEvent(event);
};

/**
 * 增加listen方法
 * @param eventName
 * @param fn
 */
HTMLElement.prototype.$listen = function(eventName, fn) {
    this.addEventListener(eventName, (e) => fn(e.detail.data))
}