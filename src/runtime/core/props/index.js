export { defineProps } from "./defineProps.js"


let props = [];
let reactiveProp = {};

export function setProps(_props) {
    props = _props;
}

export function getProps() {
    return props;
}

export function setReactiveProps(props) {
    reactiveProp = props;
}

export function getReactiveProps() {
    return reactiveProp;
}


export const updateProp = Symbol("update-prop");