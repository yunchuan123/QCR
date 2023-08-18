import { getProcessing, PROCESSING  } from "../lifrcycle/index.js";

let instance = undefined;

export function setInstance(_instance) {
    instance = _instance;
}

export function clearInstance() {
    instance = undefined;
}

export function getInstance() {
    return instance;
}

export function useInstance() {
    if (getProcessing() === PROCESSING.MOUNTED) {
        throw new Error("[CAR WARN]: 请不要在mounted中使用")
    }
    return getInstance();
}
