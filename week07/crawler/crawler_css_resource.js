const getData = require("./get.js");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const cache_data = path.resolve(__dirname, "cache.js");
const cache_html = path.resolve(__dirname, "cache.html");

void (function main() {
  if (fs.existsSync(cache_data)) {
    console.log("cache.js已存在,爬虫退出\n(清除缓存文件后再试试)");
    return;
  }

  if (fs.existsSync(cache_html)) {
    console.log("cache.html已存在,请求终止\n正在生成cache.js");
    let data = fs.readFileSync(cache_html, "utf8");
    try {
      const content = "module.exports =" + JSON.stringify(generateData(data));
      fs.writeFileSync(cache_data, content, "utf8");
      console.log(`已生成data缓存！`);
    } catch (e) {
      throw e;
    }
  } else {
    getData("https://www.w3.org/TR/?tag=css").then((res) => {
      fs.writeFileSync(cache_html, res, "utf8");
      console.clear();
      console.log(`已生成html缓存！`);
      try {
        const content = "module.exports =" + JSON.stringify(generateData(data));
        fs.writeFileSync(cache_data, content, "utf8");
        console.log(`已生成data缓存！`);
      } catch (e) {
        throw e;
      }
    });
  }
})();

function generateData(res) {
  // 处理字符串，去掉@import
  const beginPos = res.match(/<style/im).index;
  const endPos = res.match(/<\/style>/im).index + 8;
  res = res.substring(0, beginPos) + res.substring(endPos, Infinity);

  const dom = new JSDOM(res);
  const lis = dom.window.document.querySelector("#container").children;
  let data = [];

  for (let i = 0; i < lis.length; i++) {
    const li = lis[i];
    const tags = li.dataset.tag.trim().split(" ");
    if (tags.indexOf("css") === -1) continue;
    const id =
      parseInt(Math.random().toString().substring(2)) + Date.now().toString(32);
    const title = li.dataset.title.trim();
    const subTitle = li
      .getElementsByClassName("deliverer")[0]
      .textContent.trim();
    const publishDate = li
      .getElementsByClassName("pubdetails")[0]
      .textContent.trim()
      .split("\n")[0]
      .replace(/ -$/, "");
    const href = li.getElementsByTagName("a")[0].href.trim();
    const status = li.dataset.status.trim();
    data.push({
      id,
      title,
      subTitle,
      publishDate,
      href,
      tags,
      status,
    });
  }
  return data;
}
