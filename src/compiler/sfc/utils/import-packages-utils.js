const importPackageSet = new Set();

export function hasImport(key) {
    importPackageSet.has(key);
}

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
