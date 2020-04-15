/*
    手写解析只考虑HTTP的情况
    通过分步匹配减少正则复杂度
*/

export function urlParse(encodedUrl) {
  let urlObj = {
    href: "", // 完整URL,String
    protocol: "http:",  // 协议,String
    username: "",       // 用户名,String
    password: "",       // 密码,String
    hostname: "",       // 域名,String
    port: NaN,          // 端口号,Number
    pathname: "",       // 路由地址,String
    search: "",         // 请求参数,String
    hash: "",           // 哈希,String
    origin: "",     // （组合）协议+域名+端口号
    host: "",       // （组合）域名+端口号
    searchParams: {}, // （组合）请求对象
  };
  const decodeUrl = decodeURIComponent(encodedUrl);

  // 切为[路由以及之前的字符串，与参数及之后的字符串]
  const reg_split = /([^?#]+)(.*)/;
  let splitArr = decodeUrl.match(reg_split);

  // 1.1 取protocol
  if (splitArr[1].substring(0, 5).toLowerCase().indexOf("http") != -1) {
    urlObj.protocol = splitArr[1].match(/^((http|https):)/)[1];
    splitArr[1] = splitArr[1].replace(/^(http|https):\/\//, "");
  }
  // 1.2 取pathname
  if (splitArr[1].indexOf("/") != -1) {
    const pos = splitArr[1].search(/[\/]/);
    const len = splitArr[1].length;
    urlObj.pathname = splitArr[1].substring(pos, len);
    splitArr[1] = splitArr[1].replace(urlObj.pathname, "");
  }
  // 1.3 取username\password
  if (splitArr[1].indexOf("@") != -1) {
    const pos = splitArr[1].search(/[@]/);
    const loginPair = splitArr[1].substring(0, pos).split(":");
    urlObj.username = loginPair[0];
    urlObj.password = loginPair[1];
    splitArr[1] = splitArr[1].replace(splitArr[1].substring(0, pos + 1), "");
  }
  // 1.4 取hostname\port
  {
    const hostArr = splitArr[1].split(":");
    urlObj.hostname = hostArr[0];
    urlObj.port = hostArr[1] ? hostArr[1] : urlObj.port;
  }
  // 2.1 处理参数
  if (splitArr[2].indexOf("?") != -1) {
    urlObj.search = splitArr[2].match(/([^#]*)/)[1];
    const searchArr = urlObj.search
      .substring(1, urlObj.search.length)
      .split("&");
    searchArr.forEach((item) => {
      const pair = item.split("=");
      urlObj.searchParams[pair[0]] = pair[1];
    });
    splitArr[2] = splitArr[2].replace(urlObj.search, "");
  }
  // 2.2 处理哈希
  if (splitArr[2].indexOf("#") != -1) {
    urlObj.hash = splitArr[2].replace("#", "");
  }

  // 拼接
  urlObj.href = decodeUrl;
  urlObj.origin = [urlObj.protocol, "//", urlObj.hostname].join("");
  urlObj.host = urlObj.hostname;
  if (urlObj.port) {
    urlObj.origin += ":" + urlObj.port;
    urlObj.host += ":" + urlObj.port;
  }

  return urlObj;
}
