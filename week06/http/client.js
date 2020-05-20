const url = require("url");
const querystring = require("querystring");
const mime = require("./mime.js");
const Request = require("./Request.js");
const htmlParse = require("./htmlParse.js");
const { cssParse } = require("./cssParse.js");

let request = new Request({
  method: "POST",
  hostname: "127.0.0.1",
  port: 8000,
  pathname: "/",
  headers: {
    contentType: "application/json",
  },
  data: {
    name: "qyingkou",
  },
});

void (async function () {
  let response = await request.send();
  console.log(`==============responseParse==================`);
  console.log(response);

  let htmlAST = htmlParse.parse(response.body);
  console.log(`==============htmlAST=========================`);
  console.log(JSON.stringify(htmlAST));
})();
