export {
  numberLiteral,
  isBinaryNumber,
  isOctalNumber,
  isDecimalNumber,
  isHexNubmer,
} from "./util/numberLiteral.js";
export { stringLiteral } from "./util/StringLiteral.js";

export function dataType(value) {
  const typeStr = Object.prototype.toString.call(value);
  return typeStr.substring(1, typeStr.length - 1).split(" ")[1];
}
