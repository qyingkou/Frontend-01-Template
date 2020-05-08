/*
 * 入口
 * @param number {Number}
 * @param radix {number}
 * @return {Number}
 */
function convertNumberToString(number, radix) {
  // 排除NaN，分情况解析符号
  if (Number.isNaN(number)) return "NaN";
  const sign = Math.sign(number); // 1,-1,0,-0,(NaN)
  const positive = sign == 0 ? 1 / sign === Infinity : sign === 1;
  if (!Number.isFinite(number)) return (positive ? "" : "-") + "Infinity";
  // 数值转为正数
  number = positive ? number : number * -1;

  return (positive ? "" : "-") + anyRadixNumberToString(number, radix);
}

/* 任何进制数值转字符串 */
function anyRadixNumberToString(number, radix) {
  let digits = [];
  const prefixs = {
    2: "0b",
    8: "0o",
    10: "",
    16: "0x",
  };
  // 每个数组成员填充一个进制位
  while (number >= radix) {
    digits.unshift(number % radix);
    number = Math.floor(number / radix);
  }
  digits.unshift(number);
  // 转换输出
  return prefixs[radix] + anyRadixDigitsToString(digits, radix);
}

/* 任何进制位的数组转字符串 */
function anyRadixDigitsToString(digits) {
  // 取unicode码表的序号，得到字符
  return digits
    .map((item, index) => {
      if (item >= 10) return String.fromCharCode(item + "a".codePointAt());
      return String.fromCharCode(item + "0".codePointAt());
    })
    .join("");
}

/* ================================= */
/* Test Case */
function log(returnValue, assertValue) {
  const agree = returnValue === assertValue;
  const message = agree ? console.log : console.warn;
  const tpl = agree
    ? `[√] 返回值:${returnValue}(${typeof returnValue})`
    : `[x] 返回值:${returnValue}(${typeof returnValue}). 而期望值为${assertValue}`;
  message(tpl);
}
/* 十进制 */
log(convertNumberToString(123, 10), "123");
log(convertNumberToString(-123, 10), "-123");
// log(convertNumberToString(0, 10), "0");
// log(convertNumberToString(0.0, 10), "0");
// log(convertNumberToString(-0, 10), "-0");
// log(convertNumberToString(-0.0, 10), "-0");
// log(convertNumberToString(-0, 10), "-0");
// log(convertNumberToString(-0.0, 10), "-0");
// log(convertNumberToString(NaN, 10), "NaN");
// log(convertNumberToString(Infinity, 10), "Infinity");
// log(convertNumberToString(-Infinity, 10), "-Infinity");

/* 二进制 */
/* 如何区分不同的进制？？ */
log(convertNumberToString(0b11, 2), "0b11");
log(convertNumberToString(-0b11, 2), "-0b11");
// log(convertNumberToString(11, 2), "NaN");
// log(convertNumberToString(-11, 2), "NaN");
// log(convertNumberToString(0x1a1, 2), "NaN");
// log(convertNumberToString(0o11, 2), "NaN");
// log(convertNumberToString(1.1, 2), "NaN");

// console.log("===8===");
log(convertNumberToString(0o11, 8), "0o11");
log(convertNumberToString(-0o11, 8), "-0o11");

// console.log("===16===");
log(convertNumberToString(0x11, 16), "0x11");
log(convertNumberToString(-0x11, 16), "-0x11");
