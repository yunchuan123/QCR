/**
 * 等待下一次微任务执行
 * @param fn
 * @returns {Promise<*>}
 */
export function nextMicroTask(fn) {
    return Promise.resolve().then(() => fn());
}