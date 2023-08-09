import babel from "@babel/core";
import { transformIdentifier } from "./babel-plugins/transformIdentifier.js";

const cacheVariableName = new Set();

// const defaultPrefix = "this";
const defaultPrefix = "ctx";

export function setCacheVariableName(varName) {
    cacheVariableName.add(varName)
}

export function removeCacheVariable(varName) {
    cacheVariableName.delete(varName);
}

export function cacheVariableNameHas(varName) {
    return cacheVariableName.has(varName);
}

export function setPrefix(prop, _prefix) {
    const prefix = _prefix || defaultPrefix;
    if (!variableInCache(prop)) {
        return `${prefix}.${prop}`;
    } else {
        return prop;
    }
}

export function variableInCache(prop) {
    if (!prop) return "";
    const propParts = prop.split(".");
    return cacheVariableNameHas(propParts[0]);
}

export function replaceVariablesUsingStateMachine(expression) {
    expression = expression.trim();
    const transformedCode = babel.transform(expression, {
        plugins: [transformIdentifier],
        generatorOpts: {
            retainLines: true
        }
    });
    return transformedCode.code.slice(0, -1)
}

