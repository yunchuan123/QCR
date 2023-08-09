import { extractImportStatement } from "../index.js";
import fs from "fs";
import path from "path";

function reslove (filePath) { return }

test("test babel", () => {
    const code = fs.readFileSync(path.resolve(__dirname, '../index.js'), 'utf-8');
    const imports = extractImportStatement(code);
    console.log(imports)
})
