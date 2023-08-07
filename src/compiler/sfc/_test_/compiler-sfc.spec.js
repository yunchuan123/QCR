import { parse } from "../index.js";

test("should work", () => {
    const code = "<template>\n" +
        "  <div>\n" +
        "    <div>name</div>\n" +
        "  </div>\n" +
        "</template>\n" +
        "<script>\n" +
        "  const name = \"car\";\n" +
        "  const helloWorld = () => {\n" +
        "    console.log(\"I'm a car\");\n" +
        "  }\n" +
        "</script>\n" +
        "<style>\n" +
        ".test{color: red}\n" +
        "</style>\n";
    const result = parse(code);
    console.log(__dirname);
    console.log(result);
})

