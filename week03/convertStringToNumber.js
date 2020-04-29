/*
    根据字符串字面量，判断是否符合规范，不符合的返回NaN
    当字面量符合十进制时：
        - 当字符串是整数时
        - 当字符串是浮点数时
        - 当字符串是指数型时
    当字面量符合二进制时：
    当字面量符合八进制时：
    当字面量符合十六进制时：
    -------------------------------------

 */
import util from "../library/util.js";

function convertStringToNumber(str, radix) {
  if (!util.numberLiteral(str, radix)) return NaN;
  const map = {
    2: convertStringToBinary,
    8: convertStringToOctal,
    10: convertStringToDecimal,
    16: convertStringToHex,
  };
  return map[radix](str);
}
function convertStringToDecimal(literal) {
    
}
function convertStringToBinary(literal) {}
function convertStringToOctal(literal) {}
function convertStringToHex(literal) {}
/* 
    test case 
*/
console.log(convertStringToNumber("-11", 10));
console.log(convertStringToNumber("-11.1", 10));
console.log(convertStringToNumber(".0", 10));
console.log(convertStringToNumber("0.", 10));
console.log(convertStringToNumber("-0b11", 2));
console.log(convertStringToNumber("-0o11", 8));
console.log(convertStringToNumber("-0x11", 16));
