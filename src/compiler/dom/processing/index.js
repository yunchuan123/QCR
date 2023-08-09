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
