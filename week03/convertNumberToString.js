/*
 * 入口
 * @param number {Number}
 * @param radix {number}
 * @return {Number}
 */
function convertNumberToString(number, radix) {
  if (number * 1 !== number) return "NaN";
  const sign = Math.sign(number);
  let positive = true;
  if (number === 0) {
    positive = 1 / number === -Infinity ? false : true;
  } else {
    positive = sign === -1 ? false : true;
  }
  if (Math.abs(number) === Infinity) return (positive ? "" : "-") + "Infinity";
  number = positive ? number : -1 * number;

  const map = {
    2: binaryToString,
    8: octalToString,
    10: decimalToString,
    16: hexToString,
  };
  return (positive ? "" : "-") + map[radix](number);
}

/* 十进制数转字符串 */
function decimalToString(number) {
  let digits = [];

  while (number >= 10) {
    digits.unshift(number % 10);
    number = Math.floor(number / 10);
  }
  digits.unshift(number);

  return decimalDigitsToString(digits, 10);
}

/* 二进制数转字符串 */
function binaryToString(number) {
  let digits = [];

  while (number >= 2) {
    digits.unshift(number % 2);
    number = Math.floor(number / 2);
  }
  digits.unshift(number);

  return "0b" + decimalDigitsToString(digits, 2);
}

/* 八进制数转字符串 */
function octalToString(number) {
  let digits = [];

  while (number >= 8) {
    digits.unshift(number % 8);
    number = Math.floor(number / 8);
  }
  digits.unshift(number);

  return "0o" + decimalDigitsToString(digits, 8);
}

/* 十六进制数转字符串 */
function hexToString(number) {
  // todo
}

/* ================================= */
function decimalDigitsToString(digits) {
  return digits
    .map((item, index) => {
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
