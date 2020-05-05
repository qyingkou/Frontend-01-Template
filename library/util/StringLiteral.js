/* 
  ==== Unicode CodePoint-Hex: ====
  LINE FEED <LF>:           U+000A 
  CARRIAGE RETURN <CR>:     U+000D
  LINE SEPARATOR <LS>:      U+2028
  PARAGRAPH SEPARATOR <PS>: U+2029
*/
export function stringLiteral(literal) {
  const value = literal.trim();
  const reg_SingleStringCharacter_sourcecode = /^(')[^'\\\u000A\u000D\u2028\u2029]*\1$/u;
  const reg_DoubleStringCharacter_sourcecode = /^(")[^"\\\u000A\u000D\u2028\u2029]*\1$/u;
  const reg_StringCharacter = [
    /* <LS> or <PS> */
    /^[\u2028\u2029]$/u,
    /* LineContinuation */
    /^\\([\u000A]|[\u2028\]|[\u2029]|[\u000D][\u000A]|[\u000D](?![\u000A]))$/u,
    /* \ EscapeSequence */
    [
      /* CharacterEscapeSequence */
      /^\\['"\\\b\f\n\r\t\v]|[1]$/u,
      /* 0 [lookahead ∉ DecimalDigit] */
      /^\\0(?![\d])$/,
      /* HexEscapeSequence */
      /^\\x[0-9a-fA-F]{2}$/,
      /* UnicodeEscapeSequence */
      /^\\u(?:[0-9a-fA-F]{4}|u\{[\u0000-{10FFFF}]\})$/u,
    ],
  ];

  return (
    regTest(reg_SingleStringCharacter_sourcecode, value) ||
    regTest(reg_DoubleStringCharacter_sourcecode, value) ||
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
function log(exp, literal, radix) {
  console.log(`${exp.name}(${literal},${radix}) ,`, exp(literal, radix));
}

/* Usage */
// void (function main() {
//   log(stringLiteral, `"abc123你我他"`);
//   log(stringLiteral, `"abc123'你我他"`);
//   log(stringLiteral, `'abc123你我他'`);
//   log(stringLiteral, `'abc123"你我他'`);
//   log(stringLiteral, `'abc123'你我他'`);
//   log(stringLiteral, `"abc123"你我他"`);
// })();
