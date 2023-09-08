export { defineProps } from "./defineProps.js"


let props = [];

export function setProps(_props) {
    props = _props;
}

export function getProps() {
    return props;
}