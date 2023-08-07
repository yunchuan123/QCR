export default [
    {
        input: "src/compiler/index.js",
        output: {
            file: "dist/compiler.js",
            format: "esm"
        }
    },
    {
        input: "src/runtime/index.js",
        output: {
            file: "dist/runtime.js",
            format: "esm"
        }
    }
]
