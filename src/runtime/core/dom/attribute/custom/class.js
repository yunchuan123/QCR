import { effect } from "@vue/reactivity"
import { isArray, isObject, isString } from "../../../../utils/general"

export const classAttributeHandler = {
    name: ":class",
    handler({ el, value }) {
        effect(() => {
            const _value = value();
            let classList = [];
            if (isArray(_value)) {
                _value.forEach(item => {
                    if (isString(item)) {
                        classList.push(item);
                    } else if (isObject(item)) {
                        Object.keys(item).forEach(key => {
                            if (item[key]) {
                                classList.push(key);
                            }
                        })
                    }
                })
            } else if (isObject(_value)) {
                Object.keys(_value).forEach(key => {
                    if (_value[key]) {
                        classList.push(key);
                    }
                })
            }
            el.className = classList.join(" ");
        })
    }
}

