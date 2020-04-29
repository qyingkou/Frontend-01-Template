import { numberLiteral, log } from "./util/numberLiteral.js";

/* test case */
/*
void (function main() {
  // 二进制
  log(strIsNumber, `0b01`, 2);
  log(strIsNumber, `0B011`, 2);
  log(strIsNumber, `011`, 2);
  log(strIsNumber, `a011`, 2);
  // 八进制
  log(strIsNumber, `0o10`, 8);
  log(strIsNumber, `0O010`, 8);
  log(strIsNumber, `0o11`, 8);
  log(strIsNumber, `110`, 8);
  log(strIsNumber, `a110`, 8);
  // 十六进制
  log(strIsNumber, `0x10`, 16);
  log(strIsNumber, `0X010`, 16);
  log(strIsNumber, `010`, 16);
  log(strIsNumber, `a010`, 16);
  // 十进制
  log(strIsNumber, `.0`, 10);
  log(strIsNumber, `0.`, 10);
  log(strIsNumber, `0`, 10);
  log(strIsNumber, `-0`, 10);
  log(strIsNumber, `1e-3`, 10);
  log(strIsNumber, `1E3`, 10);
  log(strIsNumber, `a1GE3`, 10); // 问题项！待修复
})();
*/

export default {
  numberLiteral,
};
