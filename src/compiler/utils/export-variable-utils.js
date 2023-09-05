// 收集能导出的变量名
const variableNames = new Set();

export function setNewVarName(name) {
    variableNames.add(name);
}

export function hasVarName(name) {
    return variableNames.has(name);
}

export  function clearVarNames() {
    variableNames.clear();
}
