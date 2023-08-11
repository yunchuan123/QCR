/**
 * 通知全局目前在处理什么类型的元素
 */
export const PROCESSING_STATE = {
    DEFAULT: "default",
    FOR: "for"
}


let processing = "default";

/**
 *
 * @param {'default'|'for'} state
 */
export function changeProcessing(state) {
    processing = state;
}

export function getProcessing() {
    return processing;
}

export function resetProcessing() {
    processing = "default";
}
