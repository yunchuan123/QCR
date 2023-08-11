import ArrayUtils from "../../utils/array-utils.js";

const importPackageSet = new Set();

export function hasImport(key) {
    importPackageSet.has(key);
}

/**
 * 设置默认引入的包
 * @param packageName
 */
export function setImportPackageSet(packageName) {
    importPackageSet.add(packageName);
}

export function getImportPackageSet() {
    return importPackageSet;
}

export function clearPackage() {
    importPackageSet.clear();
}

export function generatePackagesStatement() {
    const packages = getImportPackageSet();
    let packageStr = Array.from(packages).toString();
    return `import {${packageStr}} from 'car'\n`;
}


/**
 *
 * @param {[]} imports
 */
export function importArrToString(imports) {
    if (!ArrayUtils.isNotEmpty(imports)) return "";
    let importStatement = "";
    imports.forEach(item => {
        if (item.importedVariables.length === 1 && item.importedVariables[0].type === "ImportDefaultSpecifier") {
            const name = item.importedVariables[0].name;
            const source = item.source;
            importStatement += `import ${name} from '${source}';\n`;
        } else {
            const importedVariables = item.importedVariables.map(item => item.name).toString();
            importStatement += `import {${importedVariables}} from '${item.source}';\n`;
        }
    })
    return importStatement;
}

export function setPackageName(name, source) {
    cachePackageNames.add(`${name}&${source}`);
}
