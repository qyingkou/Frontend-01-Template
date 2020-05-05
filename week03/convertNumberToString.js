/*
 * 入口
 * @param number {Number}
 * @param radix {number}
 * @return {Number}
 */
function convertNumberToString(number, radix) {
  // 返回NaN、undefined、null
  if (number * 1 !== number) return "NaN";

  const sign = Math.sign(number);
  let positive = true;
  if (number === 0) {
    // 区分-0和0
    positive = 1 / number === -Infinity ? false : true;
  } else {
    // 区分Infinity和-Infinity，或者普通数值
    positive = sign === -1 ? false : true;
  }
  // 返回Infinity和-Infinity
  if (Math.abs(number) === Infinity) return (positive ? "" : "-") + "Infinity";
  // 转为正数
  number = positive ? number : -1 * number;

  return (positive ? "" : "-") + anyRadixNumberToString(number, radix);
}

/* 任何进制数转字符串 */
function anyRadixNumberToString(number, radix) {
  let digits = [];
  const prefixs = {
    2: "0b",
    8: "0o",
    10: "",
    16: "0x",
  };
  while (number >= radix) {
    digits.unshift(number % radix);
    number = Math.floor(number / radix);
  }
  digits.unshift(number);

  return prefixs[radix] + anyRadixDigitsToString(digits, radix);
}

/* 任何进制数位的数组转字符串 */
function anyRadixDigitsToString(digits) {
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
