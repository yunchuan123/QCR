import { isArray, isObject, objectToString, isSet, isFunction, isPlainObject, isMap, isString } from "./general.js";

const replacer = (_key, val) => {
    // can't use isRef here since @vue/shared has no deps
    if (val && val.__v_isRef) {
        return replacer(_key, val.value)
    } else if (isMap(val)) {
        return {
            [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
                entries[`${key} =>`] = val
                return entries
            }, {})
        }
    } else if (isSet(val)) {
        return {
            [`Set(${val.size})`]: [...val.values()]
        }
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val)
    }
    return val
}

export const toDisplayString = (val) => {
    return isString(val)
        ? val
        : val == null
            ? ''
            : isArray(val) ||
            (isObject(val) &&
                (val.toString === objectToString || !isFunction(val.toString)))
                ? JSON.stringify(val, replacer, 2)
                : String(val)
}


