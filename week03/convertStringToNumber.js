import {
  stringLiteral,
  isBinaryNumber,
  isOctalNumber,
  isDecimalNumber,
  isHexNubmer,
} from "../library/util.js";
/*
 * 入口
 * @param str {String}
 * @param radix {number}
 * @return {Number}
 */
function convertStringToNumber(str, radix) {
  const map = {
    2: stringToBinary,
    8: stringToOctal,
    10: stringToDecimal,
    16: stringToHex,
  };
  return map[radix](str.trim());
}

/* 十进制字符串解析 */
function stringToDecimal(literal) {
  // NaN
  if (!isDecimalNumber(literal)) return NaN;
  const isExponent = /[eE]/.test(literal);
  // 区分是否为指数型
  return isExponent
    ? stringToDecimalExponent(literal)
    : stringToDecimalFloat(literal);
}
/* 十进制字符串解析 - 指数型 */
function stringToDecimalExponent(literal) {
  const positive = literal.indexOf("-") !== 0;
  literal = positive ? literal : literal.substring(1);
  const parts = literal.split(/[eE]/);
  const decimalParts = parts[0].split(".");
  const exponent = parts[1];
  let integer = decimalParts[0] || "0";
  let fraction = decimalParts[1] || "0";

  const number =
    (anyRadixToNumber(integer, 10) +
      anyRadixToNumber(fraction, 10) * Math.pow(10, -1 * fraction.length)) *
    Math.pow(10, exponent);
  return positive ? number : number * -1;
}

/* 十进制字符串解析 - 浮点型 */
function stringToDecimalFloat(literal) {
  const positive = literal.indexOf("-") !== 0;
  literal = positive ? literal : literal.substring(1);
  const parts = literal.split(/\./);
  let integerStr = parts[0] || "0";
  let fractionStr = parts[1] || "0";
  const number =
    anyRadixToNumber(integerStr, 10) +
    anyRadixToNumber(fractionStr, 10) * Math.pow(10, -1 * fractionStr.length);

  return positive ? number : number * -1;
}

/* 二进制字符串解析 */
function stringToBinary(literal) {
  // NaN
  if (!isBinaryNumber(literal)) return NaN;
  const positive = literal.indexOf("-") !== 0;
  literal = positive ? literal.substring(2) : literal.substring(3);
  // 使用十进制运算
  const number = anyRadixToNumber(literal, 2);

  return positive ? number : number * -1;
}

/* 八进制字符串解析 */
function stringToOctal(literal) {
  // NaN
  if (!isOctalNumber(literal)) return NaN;
  const positive = literal.indexOf("-") !== 0;
  literal = positive ? literal.substring(2) : literal.substring(3);
  // 使用十进制运算
  const number = anyRadixToNumber(literal, 8);

  return positive ? number : number * -1;
}

/* 十六进字符串制解析 */
function stringToHex(literal) {
  // NaN
  if (!isHexNubmer(literal)) return NaN;
  const positive = literal.indexOf("-") !== 0;
  literal = positive ? literal.substring(2) : literal.substring(3);
  // 十进制字符串运算
  const number = anyRadixToNumber(literal, 16);

  return positive ? number : number * -1;
}

/* 字符串（任何进制）转换为十进制数值 */
function anyRadixToNumber(str, radix) {
  let integerNumber = 0;
  for (let i in str) {
    // 该进制步长换算成十进制步长
    const times = radix ** (str.length - 1 - i) || 1;
    // 十进制累加
    integerNumber += anyRadixCharToNumber(str.substring(i, i + 1)) * times;
  }

  return integerNumber;
}

/* 单个字符（任何进制）转换为十进制数值 */
function anyRadixCharToNumber(anyChar) {
  const reg_number = /[\d]/;
  const reg_upperCase = /[A-F]/;

  return reg_number.test(anyChar)
    ? anyChar.codePointAt() - "0".codePointAt()
    : reg_upperCase.test(anyChar)
    ? anyChar.codePointAt() - "A".codePointAt() + 10
    : anyChar.codePointAt() - "a".codePointAt() + 10;
}

/* 
    Test Case 
*/
// // 不符合字符串
// console.log(`"1"1"`, convertStringToNumber(`"1"1"`, 10));
// console.log(`'2'2'`, convertStringToNumber(`'2'2'`, 10));

// console.log("===10===");
console.log("11", convertStringToNumber("11", 10));
// console.log("-11", convertStringToNumber("-11", 10));
// console.log("12.3", convertStringToNumber("12.3", 10));
// console.log("-11.1", convertStringToNumber("-11.1", 10));
// console.log(".0", convertStringToNumber(".0", 10));
// console.log("0.", convertStringToNumber("0.", 10));
// console.warn("0.a", convertStringToNumber("0.a", 10));
// console.warn("a.0", convertStringToNumber("a.0", 10));
// console.log("1.23e-1", convertStringToNumber("1.23e-1", 10));
// console.log("-1.23e1", convertStringToNumber("-1.23e1", 10));

// // console.log("===2===");
// console.log("0b11", convertStringToNumber("0b11", 2));
// console.log("-0b11", convertStringToNumber("-0b11", 2));
// console.warn("011", convertStringToNumber("011", 2));
// console.warn("-011", convertStringToNumber("-011", 2));
// console.warn("111", convertStringToNumber("111", 2));
// console.warn("1a1", convertStringToNumber("1a1", 2));
// console.warn("1.1", convertStringToNumber("1.1", 2));

// // console.log("===8===");
// console.log("-0o11", convertStringToNumber("-0o11", 8));
// console.log("0o11", convertStringToNumber("0o11", 8));
// console.warn("0o1a1", convertStringToNumber("0o1a1", 8));
// console.warn("011", convertStringToNumber("011", 8));
// console.warn("11", convertStringToNumber("11", 8));
// console.warn("-11", convertStringToNumber("-11", 8));
// console.warn("11.1", convertStringToNumber("11.1", 8));

// // console.log("===16===");
// console.log("0x11", convertStringToNumber("0x11", 16));
// console.log("-0x11", convertStringToNumber("-0x11", 16));
// console.log("-0x11f", convertStringToNumber("-0x11f", 16));
// console.log("0x11f", convertStringToNumber("0x11f", 16));
// console.warn("-0x11g", convertStringToNumber("-0x11g", 16));
// console.warn("0x11g", convertStringToNumber("0x11g", 16));
// console.warn("011", convertStringToNumber("011", 16));
// console.warn("0x11.1", convertStringToNumber("0x11.1", 16));
