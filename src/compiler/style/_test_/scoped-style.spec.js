import scopedStyleParser from "../scoped/index.js";

test("test scoped style should work", () => {
  scopedStyleParser(".name {div {background-color: black;}}");
});
