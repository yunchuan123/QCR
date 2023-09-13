import { effect } from "@vue/reactivity";
import { isArray, isObject, isString } from "../../../../utils/general";
import { CustomAttribute } from "../../../../../constant/attribute-name";
import { isCustomELement } from "../../../../utils/attribute-utils";
import { nextMicroTask } from "../../../../../utils/task-utils";

/**
 * 用于计算类型
 */
const types = [
  { name: "array", check: isArray },
  { name: "string", check: isString },
  { name: "object", check: isObject },
];

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
  array: (_value, classList) => {
    _value.forEach((item) => {
      if (isString(item)) {
        classList.push(item);
      } else if (isObject(item)) {
        Object.keys(item).forEach((key) => {
          if (item[key]) {
            classList.push(key);
          }
        });
      }
    });
    return classList;
  },
  object: (_value, classList) => {
    Object.keys(_value).forEach((key) => {
      if (_value[key]) {
        classList.push(key);
      }
    });
    return classList;
  },
  string: (_value, classList) => {
    classList.push(_value);
    return classList;
  },
};

export const classAttributeHandler = {
  name: CustomAttribute.CLASS,
  /**
   * 处理attribute
   * @param {{el: HTMLElement, value: any}} param0
   */
  handler({ el, value }) {
    nextMicroTask(() => {
      let realElement = isCustomELement(el) ? el.shadowRoot.firstChild : el;
      effect(() => {
        const _value = value();
        const type = calcType(_value);
        const classList = handler[type](_value, []);
        realElement.className = classList.join(" ");
      });
    })
  },
};
