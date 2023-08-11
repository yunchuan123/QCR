import { isString } from "../../../../utils/general.js";
import { CustomAttribute } from "../../../../../constant/attribute-name.js";

const collectionArr = [];
let currentMap = undefined;

export function setRefMap(key, value) {
    collectionArr[collectionArr.length - 1].set(key, value);
}

export function setCollection(map) {
    collectionArr.push(map);
}

export function popColletion() {
    collectionArr.pop();
}

export function setCurrentRefMap(map) {
    currentMap = map;
}

export function useRefs() {
    return currentMap;
}

export const refAttributeHandler = {
    name: "ref",
    handler({ el, value }) {
        if (!isString(value)) {
            throw new Error("ref must be a string");
        }
        setRefMap(value, el);
    }
}
