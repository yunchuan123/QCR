//  todo：待优化
let mountedCallBack = [];

/**
 * 收集 mounted 回调函数
 * @param {function} fn
 */
export function onMounted(fn) {
    mountedCallBack.push(fn);
}

/**
 * 收割 mounted 回调函数
 * @returns {function[]}
 */
export function collectionMountedFn() {
    const _mountedCallBack = mountedCallBack;
    mountedCallBack = [];
    return _mountedCallBack;
}

/**
 * 执行 mounted 回调函数
 * @param {function[]} fns 
 */
export function onMountedRun(fns) {
    while (fns.length > 0) {
        const fn = fns.pop();
        fn();
    }
}
