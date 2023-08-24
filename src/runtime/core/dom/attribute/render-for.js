import { carError } from "../../../utils/error-utils.js";
import { effect } from "@vue/reactivity";

/**
 * 渲染v-for的元素
 * @param {[]} arr
 * @param {() => HTMLElement} renderChildFn
 * @param {HTMLElement} el
 * @param {string} arrStr
 * @returns {*}
 */
export function renderList(arr, renderChildFn, el, arrStr) {
    if (!arr) {
        carError(`Cannot read properties of undefined (reading '${arrStr.replace("ctx.")}')`);
    }
    let cache = [];
    effect(() => {
        let _cache = [];
        const _documentFragment = document.createDocumentFragment();

        const elements = arr.map(renderChildFn);
        elements.forEach(_element => {
            const element = _element.renderFn();
            _cache.push(element);
            _documentFragment.appendChild(element);
        });
        const firstElement = cache[0];
        if (firstElement && firstElement.parentElement === el) {
            el.insertBefore(_documentFragment, firstElement);
        } else {
            el.appendChild(_documentFragment);
        }
        cache.forEach(item => {
            el.removeChild(item);
        })
        cache = _cache;
    })
}
