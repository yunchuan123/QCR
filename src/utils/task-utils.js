export function nextMicroTask(fn) {
    return Promise.resolve().then(() => fn());
}