/**
 *
 * @param {Map} map
 */
export function deepCloneMap(map) {
    const _map = new Map();
    const iterableIterator = map.keys();
    for (let key of iterableIterator) {
        _map.set(key, map.get(key));
    }
    return _map
}
