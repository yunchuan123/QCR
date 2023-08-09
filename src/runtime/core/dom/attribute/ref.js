import { deepCloneMap } from "../../../utils/clone-map.js";

const elementMap = new Map();

export function setRefMap(key, value) {
    elementMap.set(key, value);
}

export function clearRefMap() {
    elementMap.clear();
}

export function useRefs() {
    return deepCloneMap(elementMap);
}

