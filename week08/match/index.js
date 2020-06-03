/*
 * Task:输入选择器字符串，与指定元素是否匹配
 * Break Task:
 * - 实现match函数，在节点数组中查找指定元素
 * - 实现类似querySelectorAll函数,返回元素数组
 *    - 去除注释
 *    - 选择器拆词
 *        - 拆掉selectors_group --> selectors
 *        - 拆掉selector --> simple_selector_sequence + combinator
 *        - 解析combinator
 *        - 解析simple_selector_sequence
 *        - 返回selector-AST
 *    - 参考AST，查找文档中所有匹配的元素
 *    - 返回去重后的元素数组
 */
void (() => {
  // query_selector_all("* #root div.a div>[attr1=value1]");
  // query_selector_all("#root .a~div");
  query_selector_all("#root .a[attr1]");
})();

/* 匹配目标节点
 * @PARAM selectors_group {String}
 * @RETURN {Boolean}
 */
export function match(selectors_group, targetElement) {
  const elements = query_selector_all(selectors_group);
  if (elements.length === 0) return false;
  return elements.filter((elm) => elm === targetElement).length > 0;
}

/* 实现querySelectorAll
 * @PARAM selectors_group {String}
 * @RETURN {Array} - e.g.,[elm,...]
 */
export function query_selector_all(selectors_group) {
  const selectors = split_selectors_group(selectors_group);
  let result = [];

  for (let i = 0; i < selectors.length; i++) {
    let ast1 = split_selector(selectors[i]);
    let ast2 = split_simple_selector_sequence(ast1);
    // console.log("ast1:", ast1);
    console.log("ast2:", ast2);
    result.concat(findElements(document.body.parentElement, ast2));
  }
  return result;
}

/*
 * 查找和搜集元素
 */
function findElements(root, ast) {
  let combinator;
  let elements = [];
  let curElement = root;

  for (let i = 0; i < ast.length; i++) {
    const type = ast[i].type;
    const value = ast[i].value;

    if (type === "combinator") {
      combinator = value;
      continue;
    } else {
      combinator = "filter";
    }
    // TODO
    /*
    if (type === "hash") {
      elements = [document.getElementById(value)];
    } else if (type === "tag") {
      elements = [...curElement.getElementsByTagName(value)];
    } else if (type === "class") {
      elements = [...curElement.getElementsByClassName(value)];
      // console.log("class:", curElement.getElementsByClassName(value));
    } else if (type === "universal") {
      // TODO
      // console.log("universal:");
    } else if (type === "attr") {
      // console.log("attr:");
    }
    */
  }

  return elements;
}

/* 拆分selectors_group
 * selectors_group的组成：
 * selector [ COMMA S* selector ]*
 * -------------------------------------
 * @PARAM selectors_group
 * @RETURN {Array} - e.g.,[selectors,...]
 */
function split_selectors_group(selectors_group) {
  let selectors = selectors_group
    .trim()
    .split(",")
    .map((item) => item.trim());
  return selectors;
}

/* 拆分selector
 * selector的组成：
 * simple_selector_sequence [ combinator simple_selector_sequence ]*
 * combinator的组成：
 * PLUS S* | GREATER S* | TILDE S* | S+
 * -----------------------------------------------------------------
 * @PARAM selector {String}
 * @RETURN {Array} - e.g.,[{type:"waiting",value:"xxx"},...,{type:"combinator",value:"plus"}]
 */
function split_selector(selector) {
  const combinatorMap = {
    plus: /([ \t\r\n\f]*)[\+]\1/g,
    greater: /([ \t\r\n\f]*)[>]\1/g,
    tilde: /([ \t\r\n\f]*)[~]\1/g,
    space: /[ \t\r\n\f]+/g, // space放在最后
  };
  let pos = []; // 记录combinator出现的位置
  let result = [];

  Object.keys(combinatorMap).forEach((item) => {
    let matched;
    const reg = combinatorMap[item];
    while (matched !== null) {
      matched = reg.exec(selector);
      if (matched)
        pos.push({ type: item, index: matched.index, value: matched[0] });
    }
  });

  // 按index字段升序排序
  pos.sort((pre, next) => pre.index - next.index);
  // 解析selector字符串
  pos.forEach((item, index) => {
    if (index === 0) {
      result.push({
        type: "waiting",
        value: selector.substring(0, item.index),
      });
    }
    // push combinator_object
    result.push({
      type: "combinator",
      value: item.type,
    });
    // push simple_selector_sequence_object
    const start = item.index + item.value.length;
    const end = index < pos.length - 1 ? pos[index + 1].index : Infinity;
    start < end &&
      result.push({
        type: "waiting",
        value: selector.substring(start, end).trim(),
      });
  });

  return result;
}

/* 拆分simple_selector_sequence
 * simple_selector_sequence的组成：
 * [ type_selector | universal ][ HASH | class | attrib | pseudo | negation ]*
 * | [ HASH | class | attrib | pseudo | negation ]+
 *
 * attrib operator:
 * "~=" return INCLUDES;
 * "|=" return DASHMATCH;
 * "^=" return PREFIXMATCH;
 * "$=" return SUFFIXMATCH;
 * "*=" return SUBSTRINGMATCH;
 * ---------------------------------------------------------------------------
 * 暂未实现pseudo、negation、expression、universal
 * ---------------------------------------------------------------------------
 * @PARAM ast {Array}
 * @RETURN {Array} - [{type:"class",value:"xyz"},...]
 */
function split_simple_selector_sequence(ast) {
  const identMap = {
    hash: /#([_a-z0-9-]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))+/g,
    class: /\.([-]?(?:[_a-z]|(?:[^\0-\177])|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))(?:[_a-z0-9-]|(?:[^\0-\177])|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*)/g,
    attr: /\[\s*([^\]]+)?\s*\]/g,
    universal: /((?:(?:(?:[-]?(?:[_a-z]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))(?:[_a-z0-9-]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*)|[*])?[|])?[*])/g,
    // tag: /(?:(?:(?:[-]?(?:[_a-z]|[^\0-\177]|(?:[_a-z0-9-]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f])))(?:[_a-z0-9-]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*)|[\*])?[\|])?(?:[-]?(?:[_a-z]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))(?:[_a-z0-9-]|[^\0-\177]|(?:(?:\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)|\\[^\n\r\f0-9a-f]))*)/g,
  };
  let result = [];

  ast.forEach((item, index) => {
    // combinator不做处理
    if (item.type !== "waiting") {
      result.push(item);
      return;
    }

    let pos = [];
    Object.keys(identMap).forEach((itm) => {
      let matched;
      const reg = identMap[itm];
      while (matched !== null) {
        matched = reg.exec(item.value);
        if (matched)
          pos.push({
            type: itm,
            index: matched.index,
            value: matched[0],
          });
      }
    });

    // 是否为tag
    if (pos.length === 0) {
      result.push({
        type: "tag",
        value: item.value,
      });
      return;
    }

    // 按index字段升序排序
    pos.sort((pre, next) => pre.index - next.index);
    // 解析ast中type为waiting的对象
    pos.forEach((itm, idx) => {
      if (idx === 0 && itm.index !== 0) {
        result.push({
          type: "tag",
          value: item.value.substring(0, itm.index).trim(),
        });
      }
      // class,hash,attr,space
      let value = itm.value.trim();
      if (itm.type === "hash" || itm.type === "class") {
        value = value.substring(1);
        result.push({
          type: itm.type,
          value,
        });
      } else if (itm.type === "attr") {
        value = value.substring(1, itm.value.length - 2);
        const regMap = {
          ONLYNAME: /^[^=]+$/,
          INCLUDES: /~=/,
          DASHMATCH: /\|=/,
          PREFIXMATCH: /\^=/,
          SUFFIXMATCH: /\$=/,
          SUBSTRINGMATCH: /\*=/,
          EQUAL: /(?<![\~\|\^\$\*]+)[=](?![=]+)/, // 放最后
        };
        const separator = Object.keys(regMap).find((item) => {
          return regMap[item].test(value);
        });
        const kv =
          separator === "ONLYNAME"
            ? [value]
            : value.replace(regMap[separator], ",").split(",");
        result.push({
          type: itm.type,
          attribute: kv[0],
          value: kv[1],
          separator,
        });
      }
      // combinator右侧的tag
      const start = itm.index + itm.value.length;
      const end = idx < pos.length - 1 ? pos[idx + 1].index : Infinity;
      start < end &&
        item.value.substring(start, end).trim().length > 0 &&
        result.push({
          type: "tag",
          value: item.value.substring(start, end).trim(),
        });
    });
  });

  return result;
}
