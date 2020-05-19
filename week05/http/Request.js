const net = require("net");
const { ResponseParse } = require("./Response.js");

let responseParse = new ResponseParse();
class Request {
  /* 构建request实例 */
  constructor(options) {
    // 默认配置
    const defaultOptions = {
      protocol: "http",
      hostname: "127.0.0.1",
      pathname: "/",
      query: {},
      method: "GET",
      port: 80,
      headers: {
        contentType: "application/x-www-form-urlencoded",
      },
      data: null,
      comeFrom: "net-client",
      userAgent: "ToyBrowser/0.0.0.1",
    };
    this.options = Object.assign({}, defaultOptions, options);

    /* this.body */
    if (
      this.options.headers.contentType === "application/x-www-form-urlencoded"
    ) {
      if (this.options.data === null) this.options.data = "";
      this.body = encodeURIComponent(this.options.data);
    } else if (this.options.headers.contentType === "application/json") {
      if (this.options.data === null) this.options.data = {};
      this.body = JSON.stringify(this.options.data);
    }

    /* this.headers */
    this.headers = this.normalizeHeaders(this.options.headers);
    this.headers["Content-Length"] = this.body.length; // 考虑进制？

    /* this.xx */
    for (let i of Object.getOwnPropertyNames(this.options)) {
      if (i === "headers") continue;
      if (i === "data") continue;
      this[i] = this.options[i];
    }
  }
  send(connection, cb) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
        return;
      }
      connection = net.createConnection(
        { host: this.hostname, port: this.port },
        () => {
          connection.setEncoding("utf8");
        }
      );
      connection.on("connect", () => {
        console.log("Event-connect!");
        connection.write(this.request);
      });
      connection.on("ready", () => {
        console.log("Event-ready!");
      });
      connection.on("end", () => {
        console.log("Event-end!");
        connection.end();
        if (responseParse.isFinished) {
          resolve(responseParse.response);
        }
      });
      connection.on("error", (err) => {
        console.log("Event-error!", err);
        reject(err);
      });
      connection.on("data", (chunk) => {
        console.log(`-----------------chunkStart-----------------`);
        console.log(chunk);
        console.log(`-----------------chunkEnd-------------------`);
        responseParse.receive(chunk);
      });
    });
  }
  get request() {
    const self = this;
    const CRLF = "\r\n";
    const headersStr = Object.keys(self.headers)
      .map((item) => {
        return item + ":" + self.headers[item];
      })
      .join("\n");
    return (
      `${this.method} ${this.pathname} HTTP/1.1${CRLF}` +
      `Host: ${this.hostname}:${this.port}${CRLF}` +
      `${headersStr}${CRLF}${CRLF}` +
      `${this.body}`
    );
  }
  normalizeHeaders(headers) {
    let httpHeaders = {};
    Object.keys(headers).map((headerName) => {
      const fullchar = headerName.replace(/([A-Z])/g, "-$1");
      const firstchar = fullchar.substring(0, 1).toUpperCase();
      httpHeaders[firstchar + fullchar.substring(1)] = headers[headerName];
    });
    return httpHeaders;
  }
}

module.exports = {
  Request,
};
