import { getProcessing, PROCESSING  } from "../lifrcycle/index.js";
import log from "../../../utils/log.js";

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
        log.error("请不要在mounted中使用useInstance")
    }
    const instance = getInstance();
    if (!instance) {
        log.error("请不要在组件以外的地方使用useInstance")
    }
    return instance;
}
