const http = require("http");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
let data = "";

const server = http.createServer((req, res) => {
  console.log(`${req.method}`);
  console.log(`${req.httpVersion}`);
  console.log(`${req.url}`);
  console.log(req.headers);

  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    console.log(data);
    data = "";
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Come-from", "http-server");
    res.statusCode = 200;
    res.statusMessage = "Ok";
    /*
    setTimeout(() => {
      res.write(`0123456789`, "utf8");
    }, 1);
    setTimeout(() => {
      res.write(`abcdefghij`, "utf8");
    }, 2);
    setTimeout(() => {
      res.write(`一二三四五六七八九十`, "utf8");
    }, 3);
    setTimeout(() => {
      res.end(`res.end`);
    }, 10);
    */
    fs.readFile(
      path.resolve(__dirname, "./htmlTemplate.html"),
      "utf8",
      (err, data) => {
        if (err) throw err;
        // res.write();
        res.end(data, "utf8");
      }
    );
  });
});
server.listen(8000, () => {
  console.log(`server start at port 8000`);
});
