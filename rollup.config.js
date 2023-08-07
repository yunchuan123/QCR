import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
export default [
    {
        input: "src/compiler/index.js",
        output: {
            file: "dist/compiler.js",
            format: "esm"
        },
        plugins: [
            json(),
            commonjs(),
            resolve({
                exclude: ['source-map-js', 'css-tree'],
            })
        ]
    },
    {
        input: "src/runtime/index.js",
        output: {
            file: "dist/runtime.js",
            format: "esm"
        }
    }
]
