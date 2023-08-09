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

test("test for", () => {
    const template = "<template><div><div b-for='item in arr'>{{ item }}</div></div></template>"
    const code = compilerDom(template);
    console.log(code)
})

test("test for 2", () => {
    const template = "<template><div><div b-for='item in arr'><div>{{ item }}</div><div>{{ data.name }}</div></div></div></template>"
    const code = compilerDom(template);
    expect(code).toBe("createDom('div', {}, [renderList(this.arr, (item) => { return createDom('div', {}, [createDom('div', {}, [createDom('#text', {}, toDisplayString(item))]),createDom('div', {}, [createDom('#text', {}, (el) => { el.textContent = toDisplayString(this.data.name)})])])})])");
})

test("test event", () => {
    const template = "<template><div @click='handleClick'><div b-for='item in arr'>{{ item }}</div></div></template>"
    const code = compilerDom(template);
    console.log(code)
})

