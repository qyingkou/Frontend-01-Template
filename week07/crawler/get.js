const http = require("http");
const https = require("https");

function cssResCrawler(url) {
  const protol = /^https:/.test(url) ? https : http;
  return new Promise((resolve, reject) => {
    protol
      .get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];
        let error;

        if (statusCode !== 200) {
          error = new Error("请求失败\n" + `状态码: ${statusCode}`);
        } else if (!/^text\/html/.test(contentType)) {
          error = new Error(
            "无效的 content-type.\n" +
              `期望的是 text/html 但接收到的是 ${contentType}`
          );
        }
        if (error) {
          console.error(error.message);
          // 消费响应数据来释放内存。
          res.resume();
          return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        let count = 0;
        res.on("data", (chunk) => {
          rawData += chunk;
          console.clear();
          console.log(
            `正在接收第${count}个chunk ${"".padEnd(
              count < 50 ? count++ : 50,
              "."
            )}`
          );
        });
        res.on("end", () => {
          console.clear();
          console.log(
            "数据接收完毕，chunk数量为" + count + "个,正在生成缓存文件..."
          );
          resolve(rawData);
        });
      })
      .on("error", (e) => {
        console.error(`出现错误: ${e.message}`);
      });
  });
}
module.exports = cssResCrawler;
