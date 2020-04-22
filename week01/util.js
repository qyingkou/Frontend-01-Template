/*
    只解析HTTP(S)协议
    拆分字符串,减少正则的复杂度
*/

export function urlParse(encodedUrl) {
  const decodeUrl = encodedUrl && decodeURIComponent(encodedUrl).trim();
  let urlObj = {
    href: "", // 完整URL,String
    protocol: "http:", // 协议,String
    username: "", // 用户名,String
    password: "", // 密码,String
    hostname: "", // 域名,String
    port: NaN, // 端口号,Number
    pathname: "", // 路由地址,String
    search: "", // 请求参数,String
    hash: "", // 哈希,String
    origin: "", // （组合）协议+域名+端口号
    host: "", // （组合）域名+端口号
    searchParams: {}, // （组合）请求对象
  };
  if (!encodedUrl || decodeUrl === "") return urlObj;

  // 切割为[路由及之前的字符串，参数及之后的字符串]
  const reg_split = /([^?#]+)(.*)/;
  let splitedArr = decodeUrl.match(reg_split);

  // 1.1 取protocol
  if (splitedArr[1].substring(0, 5).toLowerCase().indexOf("http") != -1) {
    urlObj.protocol = splitedArr[1].match(/^((http|https):)/)[1];
    splitedArr[1] = splitedArr[1].replace(/^(http|https):\/\//, "");
  }
  // 1.2 取pathname
  if (splitedArr[1].indexOf("/") != -1) {
    const pos = splitedArr[1].search(/[\/]/);
    urlObj.pathname = splitedArr[1].substring(pos, Infinity);
    splitedArr[1] = splitedArr[1].replace(urlObj.pathname, "");
  }
  // 1.3 取username\password
  if (splitedArr[1].indexOf("@") != -1) {
    const pos = splitedArr[1].search(/[@]/);
    const loginPair = splitedArr[1].substring(0, pos).split(":");
    urlObj.username = loginPair[0];
    urlObj.password = loginPair[1];
    splitedArr[1] = splitedArr[1].replace(splitedArr[1].substring(0, pos + 1), "");
  }
  // 1.4 取hostname\port
  {
    const hostArr = splitedArr[1].split(":");
    if (/^([\w][\w-]*[\.])+[\w][\w-]*/.test(hostArr[0]))
      console.warn("URL不符合规范");
    urlObj.hostname = hostArr[0];
    urlObj.port = hostArr[1] ? hostArr[1] : urlObj.port;
  }
  // 2.1 处理参数
  if (splitedArr[2].indexOf("?") != -1) {
    urlObj.search = splitedArr[2].match(/([^#]*)/)[1];
    const searchArr = urlObj.search
      .substring(1, Infinity)
      .split("&");
    searchArr.forEach((item) => {
      const pair = item.split("=");
      urlObj.searchParams[pair[0]] = pair[1];
    });
    splitedArr[2] = splitedArr[2].replace(urlObj.search, "");
  }
  // 2.2 处理哈希
  if (splitedArr[2].indexOf("#") != -1) {
    urlObj.hash = splitedArr[2].replace("#", "");
  }

  // 其他
  urlObj.href = decodeUrl;
  urlObj.origin = [urlObj.protocol, "//", urlObj.hostname].join("");
  urlObj.host = urlObj.hostname;
  if (urlObj.port) {
    urlObj.origin += ":" + urlObj.port;
    urlObj.host += ":" + urlObj.port;
  }

  return urlObj;
}
