/*
 *  UTF8编码
 *  @param char {String} 单个字符
 *  @return {Buffer}
 */
function UTF8Encoding(char) {
  // 计算编码需要的字节数
  let byteSize = getUTF8ByteSize(char);
  // buffer操作
  return getBuffer(char, byteSize);
}
/*
 *  计算UTF8编码需要的字节数
 *  @param char {String} 单个字符
 *  @return {Number}
 */
function getUTF8ByteSize(char) {
  const char_binary = char.codePointAt().toString(2);
  let byteSize = 1;
  while (byteSize < 8) {
    if (char_binary.length <= 7) break;
    if (
      char_binary.length <=
      byteSize * 8 - (byteSize + 1) - 2 * (byteSize - 1)
    )
      break;
    byteSize++;
  }
  return byteSize;
}
/*
 *  生成UTF8编码的二进制位数组
 *  @param binaryStr  {String} 二进制位字符串
 *  @param byteSize   {Number}
 *  @return {Array}
 */
function getUTF8Array(binaryStr, byteSize) {
  let array = [];
  let value = "00000000";

  for (let i = 0; i < byteSize; i++) {
    const prefix =
      byteSize > 1
        ? (function () {
            if (i > 0) return "10";
            let p = "";
            for (let j = byteSize; j > 0; j--) {
              p += "1";
            }
            return p + "0";
          })()
        : "0";
    const clip = (function () {
      if (i === 0 && byteSize === 1) return binaryStr;
      return strSplitFromEnd(binaryStr, 6)[i];
    })();
    array.push({
      prefix,
      value: value.substring(
        0,
        prefix.length - clip.length == 8 ? "" : 8 - prefix.length - clip.length
      ),
      clip,
    });
  }

  return array;
}
/*
 *  生成buffer
 *  @param char  {String} 字符
 *  @param byteSize  {Number} 编码字节数
 *  @return {Buffer}
 */
function getBuffer(char, byteSize) {
  // 二进制位数组
  const utf8ByteArray = getUTF8Array(char.codePointAt().toString(2), byteSize);
  // 数值转字符串
  const __utf8ByteArray = utf8ByteArray.map((item, index) => {
    return item.prefix + item.value + item.clip;
  });
  // 开启缓存并写入
  let buffer = new ArrayBuffer(byteSize);
  let dv = new DataView(buffer);
  __utf8ByteArray.forEach((item, index) => {
    const utf8Demical = parseInt(item, 2);
    dv.setUint8(index, utf8Demical);
  });

  return buffer;
}
/* 切割字符串为数组 */
function strSplitFromEnd(str, limit) {
  let count = 0;
  let array = [];
  while (str.length - limit * count > 0) {
    const startPos = str.length - limit * (count + 1);
    const endPos = str.length - limit * count;
    array.unshift(str.substring(startPos, endPos));
    count++;
  }

  return array;
}

// 前置条件
// 字符转数组
// 遍历数组，每个字符转二进制字符串
void (function main() {
  /* Test case */
  console.log(UTF8Encoding(String.fromCodePoint(0b1111111)));
  console.log(UTF8Encoding(String.fromCodePoint(0b11111111111)));
  console.log(UTF8Encoding(String.fromCodePoint(0b1111111111111111)));
  console.log(UTF8Encoding(String.fromCodePoint(0b100001111111111111111)));
  // console.log(UTF8Encoding("A")); // 41,length:7，1byte
  // console.log(UTF8Encoding("严")); // 4e25,length:15，3byte
  // console.log(UTF8Encoding("𝌆")); // 1D306，length:17
})();
