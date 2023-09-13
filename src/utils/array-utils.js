function cloneDeep(arr) {
    if (Array.isArray(arr)) {
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            newArr[i] = cloneDeep(arr[i]);
        }
        return newArr;
    } else {
        return arr;
    }
}

export default {
    isNotEmpty(arr) {
        return Array.isArray(arr) && arr.length > 0;
    },
    cloneDeep
}
