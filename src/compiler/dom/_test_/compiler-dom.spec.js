import compilerDom from "../index.js";

test("test", () => {
    const template = "<template><div><span class='text' style='color: red'>123</span><span>789</span></div></template>"
    const code = compilerDom(template)
    console.log(code);
})

test("test effect", () => {
    const template = "<template><div>{{ name }}</div></template>"
    const code = compilerDom(template);
    console.log(code)
})
