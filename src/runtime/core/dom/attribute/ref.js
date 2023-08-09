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

