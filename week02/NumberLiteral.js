/*
 * @param literal {String}
 * @return {Number}
 */
function numberLiteral(literal, radix) {
  const map = {
    2: isBinaryNumber,
    8: isOctalNumber,
    10: isDecimalNumber,
    16: isHexNubmer,
  };
  return map[radix](literal);
}
function isBinaryNumber(literal) {
  const reg = /^0[bB][0-1]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isOctalNumber(literal) {
  const reg = /^0[oO][0-7]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isHexNubmer(literal) {
  const reg = /^0[xX][0-9a-fA-F]+$/;
  const value = literal.trim();
  return reg.test(value);
}
function isDecimalNumber(literal) {
  const value = literal.trim();
  // 规则
  const DecimalInteger = "0|([1-9][\\d]*)"; // 十进制整数
  const DecimalDigits = "[\\d]*"; // 十进制小数
  const ExponentPart = "[eE][1-9][\\d]*"; // 十进制指数
  // 组合
  const regs = [
    new RegExp(
      `(?:${DecimalInteger})(?:\\.${DecimalDigits})(?:${ExponentPart})*`
    ),
    new RegExp(`(?:\\.${DecimalDigits})(?:${ExponentPart})*`),
    new RegExp(`(?:${DecimalInteger})(?:${ExponentPart})*`),
  ];

  const arr = regs.filter((item) => {
    const ret = item.test(value);
    if (ret) return true;
  });

  return arr.length > 0;
}
function log(exp, literal, radix) {
  console.log(`${exp.name}(${literal},${radix}) ,`, exp(literal, radix));
}

/* Usage */
void (function main() {
  // 二进制
  log(numberLiteral, `0b01`, 2);
  log(numberLiteral, `0B011`, 2);
  log(numberLiteral, `011`, 2);
    log(numberLiteral, `0o10`, 8);
    log(numberLiteral, `0O010`, 8);
    log(numberLiteral, `0o11`, 8);
    log(numberLiteral, `110`, 8);
  log(numberLiteral, `0x10`, 16);
  log(numberLiteral, `0X010`, 16);
  log(numberLiteral, `010`, 16);
  log(numberLiteral, `.0`, 10);
    log(numberLiteral, `0.`, 10);
    log(numberLiteral, `0`, 10);
    log(numberLiteral, `-0`, 10);
    log(numberLiteral, `1e-3`, 10);
    log(numberLiteral, `1E3`, 10);
    // log(numberLiteral, `a1GE3`, 10); // 问题项！待修复
})();
