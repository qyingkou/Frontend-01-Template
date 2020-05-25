const url = require("url");
const querystring = require("querystring");
const mime = require("./mime.js");
const Request = require("./Request.js");
const htmlParse = require("./htmlParse.js");
const render = require("./render.js");
const images = require("images");

void (async function () {
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

  let response = await request.send();
  let dom = htmlParse.parse(response.body);
  let viewport = images(800, 600);
  render(viewport, dom);
  viewport.save("viewport.jpg"); // 一片漆黑
})();
