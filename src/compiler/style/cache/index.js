const cache = new Map();

/**
 * 设置缓存CacheMap
 * @param {string} key
 * @param {string} fn
 */
export function setCacheMap(key, fn) {
    cache.set(key, fn);
}

export function getCacheMap() {
    return cache;
}
