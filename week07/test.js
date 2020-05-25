const css = require("css");

var ast = css.parse(
  "body.clazz,div.first,div~div p { color:red; } div{color:green;}",
  {
    source: "source.css",
  }
);

var css1 = css.stringify(ast);

var result = css.stringify(ast, { sourcemap: true });

/*
console.log("[result.code]:", result.code); // string with CSS
console.log("[css]:", css1);
*/

console.log("[AST]:", JSON.stringify(ast, null, "    "));
console.log("result.map", result.map); // source map object
