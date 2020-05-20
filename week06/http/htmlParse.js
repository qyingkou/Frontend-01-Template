/*
 * @param htmlStr {String}
 * @return AST {Object}
 * 备注：
 * html词法标准： html.spec.whatwg.org/multipage/parsing.html
 * 使用有限状态机（FSM）来实现HTML的分析
 * --- 3 解析标签 ---
 * 标签类型：开始标签、结束标签、自封闭标签
 * --- 4 创建元素 ---
 * 状态机中，除了状态迁移，我们还要加入业务逻辑
 * 在标签结束状态提交标签token
 * --- 5 属性 -------
 * 
 * --- 6 ---
 * 从标签构建DOM树的基本技巧是使用栈
 * 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
 * 自封闭节点可视为入栈后立即出栈
 * 任何元素的父元素是它入栈前的栈顶
 */

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [
  {
    type: "document",
    children: [],
  },
];

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
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    top.children.push(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
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

const EOF = Symbol("EOF"); // EOF:End Of File

function parse(htmlStr) {
  let state = data;
  for (let char of htmlStr) {
    state = state(char);
  }
  state = state(EOF);
  return stack[0];
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
