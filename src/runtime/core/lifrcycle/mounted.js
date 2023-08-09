//  todo：待优化
let mountedCallBack = [];

/**
 * 声明周期函数
 * @param {function} fn
 */
export function onMounted(fn) {
    mountedCallBack.push(fn);
}

export function collectionMountedFn() {
    const _mountedCallBack = mountedCallBack;
    mountedCallBack = [];
    return _mountedCallBack;
}

export function onMountedRun(fns) {
    while (fns.length > 0) {
        const fn = fns.pop();
        fn();
    }
}
