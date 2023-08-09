const mountedCallBack = [];

/**
 * 声明周期函数
 * @param {function} fn
 */
export function onMounted(fn) {
    mountedCallBack.push(fn);
}

export function onMountedRun() {
    while (mountedCallBack.length > 0) {
        const fn = mountedCallBack.pop();
        fn();
    }
}
