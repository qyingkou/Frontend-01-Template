/* 
Unicode CodePoint-Hex:

LINE FEED <LF> U+000A 
CARRIAGE RETURN <CR> U+000D
LINE SEPARATOR <LS> U+2028
PARAGRAPH SEPARATOR <PS> U+2029
*/
function stringLiteral(literal) {
  let flag = [];
  const value = literal.trim();
  const reg_SingleStringCharacter = /^(')[^'\\\u000A\u000D\u2028\u2029]*\1$/u;
  const reg_DoubleStringCharacter = /^(")[^"\\\u000A\u000D\u2028\u2029]*\1$/u;
  const reg_StringCharacter = [
    /^[\u2028\u2029]$/, // <LS> or <PS>
    /^\\([\u000A]|[\u2028\]|[\u2029]|[\u000D][\u000A]|(?<![\u000A])[\u000D])$/, // LineContinuation
    /* \ EscapeSequence */
    [
      /^\\['"\\\b\f\n\r\t\v]|[1]$/u, // CharacterEscapeSequence
      /^\\(?<![\d])0$/, // 0 [lookahead ∉ DecimalDigit]
      /^\\x[0-9a-fA-F]{2}$/, // HexEscapeSequence
      /^\\u(?:[0-9a-fA-F]{4}|u\{[\u0000-{10FFFF}]\})$/u, // UnicodeEscapeSequence
    ],
  ];

  return (
    regTest(reg_SingleStringCharacter, value) ||
    regTest(reg_DoubleStringCharacter, value) ||
    regTest(reg_StringCharacter[0]) ||
    regTest(reg_StringCharacter[1]) ||
    regTest(reg_StringCharacter[2][0]) ||
    regTest(reg_StringCharacter[2][1]) ||
    regTest(reg_StringCharacter[2][2]) ||
    regTest(reg_StringCharacter[2][3])
  );
}
function regTest(reg, value) {
  return new RegExp(reg).test(value);
}
function dataType(value) {
  const typeStr = Object.prototype.toString.call(value);
  return typeStr.substring(1, typeStr.length - 1).split(" ")[1];
}
function log(exp, literal, radix) {
  console.log(`${exp.name}(${literal},${radix}) ,`, exp(literal, radix));
}

/* Usage */
void (function main() {
  log(stringLiteral, `"abc123你我他"`);
  log(stringLiteral, `"abc123'你我他"`);
  log(stringLiteral, `'abc123你我他'`);
  log(stringLiteral, `'abc123"你我他'`);
  log(stringLiteral, `'abc123'你我他'`);
  log(stringLiteral, `"abc123"你我他"`);
})();
