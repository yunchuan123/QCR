export * from "./mounted.js";

/**
 * 通知全局目前在什么生命周期阶段
 */
export const PROCESSING = {
    MOUNTED: "mounted"
}

let processing = undefined;

export function setProcessing(_processing) {
    processing = _processing
}

export function getProcessing() {
    return processing;
}

export function resetProcessing() {
    processing = undefined;
}