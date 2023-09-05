import resolve from "@rollup/plugin-node-resolve"

export default [
    {
        input: "src/compiler/index.js",
        output: {
            file: "dist/compiler.js",
            format: "esm"
        },
        plugins: [
            // resolve()
        ]
    },
    {
        input: "src/runtime/index.js",
        output: {
            file: "dist/runtime.js",
            format: "esm"
        },
        plugins: [
            resolve()
        ]
    }
]
