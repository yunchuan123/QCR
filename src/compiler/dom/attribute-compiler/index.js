import { setPrefix } from "../variable-name/index.js";
import { CustomAttributeArr } from "../../../constant/attribute-name.js";
import {getProcessing, PROCESSING_STATE} from "../processing/index.js";
import ObjectUtils from "../../../utils/object-utils.js";
import register from "./custom/index.js";
import { processEventHandler } from "./custom/event.js";

const AttrType = {
    REACTIVE: "reactive",
    DEFAULT: "default",
    CUSTOM: "custom",
    Event: "event"
}

const attributeCompiler = {};

export function registerAttributeCompiler(_attributeCompiler) {
    attributeCompiler[_attributeCompiler.name] = _attributeCompiler;
}

register(); // 注册所有处理器

function check(items) {
    let hasFor = false;
    let hasIf = false;

    items.forEach((item) => {
        if (getProcessing() === PROCESSING_STATE.FOR && ["ref", ":ref"].includes(item.name)) {
            throw new Error("请勿将ref定义在b-for子元素上");
        }
        if (item.name === "v-for") {
            hasFor = true;
        }
        if (item.name === "v-if") {
            hasIf = true;
        }
        if (hasFor && hasIf) {
            throw new Error("请勿将v-if定义在v-for子元素上");
        }
    })
    
}

/**
 *  将attributes转换为json
 * @param {{name: string, value: string}[]} attributes
 */
export default function (attributes = []) {
    let result = [];
    check(attributes) // 检查attribute的合法性
    attributes.forEach((item) => {
        const attrVo = defineAttributeType(item);
        switch (attrVo.type) {
            case AttrType.EVENT:
                result.push(processEventHandler(attrVo));
                break;
            case AttrType.CUSTOM:
                if (ObjectUtils.hasKey(attributeCompiler, item.name)) {
                    result.push(attributeCompiler[item.name].handler(attrVo));
                }
                break;
            case AttrType.REACTIVE:
                result.push(generateEffectStatement(item));
                break;
            case AttrType.DEFAULT:
                result.push(`'${item.name}': '${item.value}'`);
                break;
        }
    });
    return `{${result.toString()}}`;
}

function defineAttributeType(attr) {
    if (isEvent(attr)) {
        return { type: AttrType.EVENT, attr}
    } else if (isCustom(attr)) {
        return { type: AttrType.CUSTOM, attr }
    } else if (isReactiveAttribute(attr)) {
        return { type: AttrType.REACTIVE, attr }
    } else {
        return { type: AttrType.DEFAULT, attr }
    }
}

function isCustom(attr) {
    return !!CustomAttributeArr.includes(attr.name);
}

/**
 * 是否为事件监听
 * @param {{name: stirng, value: string}} attr 
 * @returns 
 */
function isEvent(attr) {
    return attr.name.startsWith("@");
}

/**
 *  确认是否为响应式属性
 * @param {{[name: string]: [value: string]}} attr
 * @returns {boolean}
 */
function isReactiveAttribute(attr) {
    return attr.name.startsWith(":");
}

function generateEffectStatement(attr) {
    return `${attr.name.replace(":", "")}: () => { return ${setPrefix(attr.value)}}`
}


export { findFor } from "./custom/for.js";
