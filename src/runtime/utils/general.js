export const isArray = Array.isArray;

export const isObject = (val) => val !== null && typeof val === 'object';

export const objectToString = Object.prototype.toString

export const isFunction = (val) =>
    typeof val === 'function'

export const isSet = (val) =>
toTypeString(val) === '[object Set]'


export const toTypeString = (value) =>
    objectToString.call(value)

export const isPlainObject = (val) =>
    toTypeString(val) === '[object Object]'

export const isMap = (val) =>
toTypeString(val) === '[object Map]'

export const isString = (val) => typeof val === 'string'
