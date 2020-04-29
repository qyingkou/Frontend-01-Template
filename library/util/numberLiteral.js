/*
 * @param literal {String}
 * @return {Number}
 */
export function numberLiteral(literal, radix) {
  const map = {
    2: isBinaryNumber,
    8: isOctalNumber,
    10: isDecimalNumber,
    16: isHexNubmer,
  };
  return map[radix](literal);
}
function isBinaryNumber(literal) {
  const reg = /^[\\-]*0[bB][0-1]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isOctalNumber(literal) {
  const reg = /^[\\-]*0[oO][0-7]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isHexNubmer(literal) {
  const reg = /^[\\-]*0[xX][0-9a-fA-F]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isDecimalNumber(literal) {
  const value = literal.trim();
  // 规则
  const DecimalInteger = "(?:0|(?:[1-9][\\d]*))"; // 十进制整数
  const DecimalDigits = "[\\d]*"; // 十进制小数
  const ExponentPart = "[eE][\\-]*[1-9][\\d]*"; // 十进制指数
  // 组合
  const regs = [
    new RegExp(
      `^[\\-]*(?:${DecimalInteger})(?:\\.${DecimalDigits})(?:${ExponentPart})*$`
    ),
    new RegExp(`^[\\-]*(?:\\.${DecimalDigits})(?:${ExponentPart})*$`),
    new RegExp(`^[\\-]*(?:${DecimalInteger})(?:${ExponentPart})*$`),
  ];

  const arr = regs.filter((item) => {
    const ret = item.test(value);
    if (ret) return true;
  });

  return arr.length > 0;
}
export function log(exp, literal, radix) {
  console.log(`${exp.name}(${literal},${radix}) ,`, exp(literal, radix));
}
