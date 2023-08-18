export * from "./mounted.js";

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