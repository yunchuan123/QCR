import { isArray, isObject, isFunction } from "../../utils/general";
import log from "../../../utils/log";
import { setProps, setReactiveProps } from "./index.js";
import { reactive } from "@vue/reactivity";

export function defineProps(props) {
    const propObj = {};
    const _propsArr = [];
    if (isArray(props)) {
        _propsArr = props;
        props.forEach(key => {
            propObj[key] = undefined;
        })
    } else if (isObject(props)) {
        let keys = Object.keys(props);
        keys.forEach(key => {
            _propsArr.push(key);
            const item = props[key];
            if (item.default) {
                if (isFunction(item.default)) {
                    propObj[key] = item.default();
                } else {
                    propObj[key] = item.default;
                }
            }
        })
    }
    setProps(_propsArr)
    const reactiveProps = reactive(propObj);
    setReactiveProps(reactiveProps)
    return reactiveProps;
}