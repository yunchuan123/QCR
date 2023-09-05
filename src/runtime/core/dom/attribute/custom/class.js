import { effect } from "@vue/reactivity"
import { isArray, isObject, isString } from "../../../../utils/general";
import { CustomAttribute } from "../../../../../constant/attribute-name";

/**
 * 用于计算类型
 */
const types = [
    { name: "array", check: isArray },
    { name: "string", check: isString },
    { name: "object", check: isObject }
]

/**
 * 计算类型
 * @param {string} _value
 * @returns
 */
function calcType(_value) {
    for (let item of types) {
        if (item.check(_value)) {
            return item.name;
        }
    }
}

/**
 * 处理class的策略模式
 */
const handler = {
    "array": (_value, classList) => {
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
        return classList;
    },
    "object": (_value, classList) => {
        Object.keys(_value).forEach(key => {
            if (_value[key]) {
                classList.push(key);
            }
        })
        return classList;
    },
    "string": (_value, classList) => {
        classList.push(_value);
        return classList;
    }
}

export const classAttributeHandler = {
    name: CustomAttribute.CLASS,
    handler({ el, value }) {
        effect(() => {
            const _value = value();
            const type = calcType(_value);
            const classList = handler[type](_value, [])
            el.className = classList.join(" ");
        })
    }
}

