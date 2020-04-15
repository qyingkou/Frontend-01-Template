import { urlParse } from "./util.js";

const url = encodeURIComponent("https://username1:password1@news.baidu.com:1234/path1/path2/path3?name=ck&age=18#hash9");

/* urlParse */
console.log(urlParse(url));

/* 直接使用window.location的属性 */
console.log(location);

/* 直接使用 new URL(url) */
const urlObj = new URL(decodeURIComponent(url));
console.log(urlObj);