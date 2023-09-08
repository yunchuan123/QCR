import { isArray } from "../../utils/general";
import log from "../../../utils/log";
import { setProps } from "./index.js";

export function defineProps(props) {
    if (!isArray(props)) {
        log.error("请正确定义props");
    }
    setProps(props)
}