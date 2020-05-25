const css = require("css");
const layout = require("./layout.js");

const EOF = Symbol("EOF"); // EOF:End Of File
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [
  {
    type: "document",
    children: [],
  },
];

/* css计算相关 */
let rules = [];
function addCSSRules(text) {
  const ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "   "));
  rules.push(...ast.stylesheet.rules);
}
function match(element, selector) {
  if (!selector || !element.attributes) return false;
  if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) return true;
  } else if (selector.charAt(0) === ".") {
    var attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) return true;
  } else {
    if (element.tagName === selector) return true;
  }
}
function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];
  return sp1[3] - sp2[3];
}

function computeCSS(element) {
  // 从栈中取所有的父元素
  let elements = stack.slice().reverse();
  if (!element.computedStyle) element.computedStyle = {};

  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) continue;

    var j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) j++;
    }
    if (j >= selectorParts.length) matched = true;

    if (matched) {
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        let property = computedStyle[declaration.property];
        if (!property) property = {};
        if (!property.specificity) {
          property.value = declaration.value;
          property.specificity = sp;
        } else if (compare(property.specificity, sp) < 0) {
          for (let k = 0; k < 4; k++) {
            computedStyle[declaration.property][declaration.value][k] += sp[k];
          }
        }
      }
    }
  }
}

function parse(htmlStr) {
  let state = data;
  for (let char of htmlStr) {
    state = state(char);
  }
  state = state(EOF);
  return stack[0];
}

function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" || p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    // 及时对每个元素进行CSS属性计算
    computeCSS(element);

    top.children.push(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // 遇到style标签时，执行添加css规则的操作
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

/* 12.2.5.1 Data state */
function data(char) {
  if (char === "<") {
    return tagOpen;
  } else if (char === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: char,
    });
    return data;
  }
}
function tagOpen(char) {
  if (char === "/") {
    return endTagOpen;
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(char);
  } else {
    emit({
      type: "text",
      content: char,
    });
    return;
  }
}
function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(char);
  } else if (char === ">") {
  } else if (char === EOF) {
  } else {
  }
}
function tagName(char) {
  if (char.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (char === "/") {
    return selfClosingStartTag;
  } else if (char.match(/^[a-zA-z]$/)) {
    currentToken.tagName += char.toLowerCase();
    return tagName;
  } else if (char === ">") {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += char;
    return tagName;
  }
}
function selfClosingStartTag(char) {
  if (char === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (char === EOF) {
    // todo
  } else {
    // todo
  }
}

function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (char === "/" || char === ">" || char === EOF) {
    return afterAttributeName(char);
  } else if (char === "=") {
    // tood
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(char);
  }
}
function attributeName(char) {
  if (
    char.match(/^[\t\n\f\s]$/) ||
    char === "/" ||
    char === ">" ||
    char === EOF
  ) {
    return afterAttributeName(char);
  } else if (char === "=") {
    return beforeAttributeValue;
  } else if (char === "\u0000") {
    // NULL
  } else if (char === '"' || char === "'" || char === "<") {
    // todo
  } else {
    currentAttribute.name += char;
    return attributeName;
  }
}
function afterAttributeName(char) {
  if (char.match(/^[\t\n\f\s]$/)) {
    return afterAttributeName;
  } else if (char === "/") {
    return selfClosingStartTag;
  } else if (char === "=") {
    return beforeAttributeValue;
  } else if (chzr === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char === EOF) {
    // todo
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
  }
}

function beforeAttributeValue(char) {
  if (
    char.match(/^[\t\n\f\s]$/) ||
    char === "/" ||
    char === ">" ||
    char === EOF
  ) {
    return beforeAttributeValue;
  } else if (char === '"') {
    return doubleQuotedAttributeValue;
  } else if (char === "'") {
    return singleQuotedAttributeValue;
  } else if (char === ">") {
    // todo
  } else {
    return UnquotedAttributeValue(char);
  }
}
function singleQuotedAttributeValue(char) {
  if (char === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
  } else if (char === "\u0000") {
    // todo
  } else if (char === EOF) {
    // todo
  } else {
    currentAttribute.value += char;
    return doubleQuotedAttributeValue;
  }
}
function doubleQuotedAttributeValue(char) {
  if (char === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (char === "\u0000") {
    // NULL
  } else if (char === EOF) {
    // todo
  } else {
    currentAttribute.value += char;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(char) {
  if (char.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (char === "/") {
    return selfClosingStartTag;
  } else if (char === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char === EOF) {
    // todo
  } else {
    currentAttribute.value += char;
    return doubleQuotedAttributeValue;
  }
}
function UnquotedAttributeValue(char) {
  if (char.match(/^[\t\n\f\s]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (char === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (char === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char === "\u0000") {
    // Null
  } else if (
    char === '"' ||
    char === "'" ||
    char === "<" ||
    char === "=" ||
    char === "`"
  ) {
    // todo
  } else if (char === EOF) {
    // todo
  } else {
    currentAttribute.value += char;
    return UnquotedAttributeValue;
  }
}

module.exports = {
  parse,
};
