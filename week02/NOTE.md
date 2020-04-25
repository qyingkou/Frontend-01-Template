# 作业列表
## 作业A：写一个正则表达式 匹配所有 Number 直接量
> 作业说明
```
打开NumberLiteral.html,打开devtool-console面板，查看测试结果
```
> 作业分析过程：

参考：ECMA文档的《11.8.3 Numeric Literals》章节

Number字面量的定义：
- 二进制的组成
    - 0b 二进制数值
    - 0B 二进制数值
- 八进制的组成
    - 0o 八进制数值
    - 0O 八进制数值
- 十进制的组成
    - 十进制整数 . 十进制小数 十进制指数(可选)
    - . 十进制小数 十进制指数(可选)
    - 十进制整数 十进制指数(可选)
- 十六进制
    - 0x 十六进制数值
    - 0X 十六进制数值

组成分析:
- 二进制数值 ::= /[0-1]+/
- 八进制数值 ::= /[0-7]+/
- 十六进制数值 ::= /[0-9a-fA-F]+/
- 十进制指数 ::= /[eE][1-9][\d]*/
- 十进制整数 ::= /0|[1-9][\d]*/
- 十进制小数 ::= /[\d]*/

最后组合以上条件

<br><br><br><br>

---
## 作业B：写一个正则表达式，匹配所有的字符串直接量、单引号和双引号
> 作业说明
```
打开StringLiteral.html,打开devtool-console面板，查看测试结果
```
> 作业分析过程

参考：ECMA文档的《11.8.4 String Literals》章节

String字面量的定义：
- "双引号内的字符串内容"
- '单引号内的字符串内容'

单引号内的字符串内容: 
- 除' \ <LineTerminator>以外的任何unicode字符。

双引号内的字符串内容：
- 除" \ <LineTerminator>以外的任何unicode字符。

公共的字符：
- < LS> 
- < PS> 
- \ < EscapeSequence>
- < LineContinuation>
    - < LF>
    - < CR>[lookahead ≠ < LF>]
    - < LS>
    - < PS>
    - < CR>< LF>
- EscapeSequence
    - CharacterEscapeSequence 
    - 0 [lookahead ∉ DecimalDigit]  
    - HexEscapeSequence  
    - UnicodeEscapeSequence  

最后组合以上条件


<br><br><br><br>

---
## 作业C:写一个 UTF-8 Encoding 的函数
> 作业说明
```
打开UTF8Encoding.html，打开devtool面板，查看结果
```

> 作业分析过程
```
utf8的编码过程
    字符码点 --> 二进制码点
    二进制码点 --> 判断utf8字节数
    utf8的第一个字节的编码构成: [字节编码位]0[编码位]
    utf8的非第一个字节的编码构成:[占位符10][编码位]
    从后向左截取的方向，将二进制码点填入utf8字符的编码位，未填满的编码位补0
buffer的写入过程
    利用ArrayBuffer来开创内存空间
    使用DataView来读写内存，本例使用8bit
```





<br><br><br><br>

---
## 每周总结
> 知识盘点

## week02.01直播课(编程语言的一般规律)
#### 语言的分类
- 非形式语言(如中文、英文)
- 形式语言（乔姆斯基谱系）
    - 0型文法（无限制文法或短语结构文法），包括所有的文法。
    - 1型文法（上下文相关文法），生成上下文相关语言。
    - 2型文法（上下文无关文法），生成上下文无关语言。
js绝大多数情况是上下文关系
    - 3型文法（正规文法），生成正则语言。
#### 巴科斯范式BNF
形式化语言可以使用BNF来描述  

#### 语言的一些概念
- 图灵完备
- 动态与静态
- 类型系统

#### 一般命令式编程语言的结构

- Atom 原子
    - Identifier
    - Literal
- Expression 表达式
    - Atom
    - Operator 操作符
    - Punctuator 标点符号
- Statement 语句、表述
    - Expression
    - Keyword 关键字
    - Punctuator
- Structure 结构化程序设计的设施（构造域相关的概念）
    - Function
    - Class
    - Process
    - Namespace
（以及其他引入结构化的方式来帮助我们整理代码）
- Program 
    - Program
    - Module
    - Package
    - Library


## week02.02直播课(词法分析)
### 字符集和字符编码
unicode
    基本平面
    辅助平面
    javascript的相关接口
utf8编码
    可变字节
### ECMAScript标准阅读
- NumberLiteral
- StringLiteral

## 最后补充了一波脑图

<br><br>

> 问题罗列

ECMA262规范的产生式描述很晦涩，比方说：“0 [lookahead ∉ DecimalDigit]”、“&lt;CR&gt;[lookahead ≠ &lt;LF&gt;]”。  
我想问：  
1. “lookahead”这种表述在标准中有解释吗，是不是还有“lookbehide”以及更多表示方向的单词？ 
2. ∉和≠符号在标准中有解释吗，还有哪些符号呢？  
3. “0 [lookahead ∉ DecimalDigit]”中的中括号，是表示一个字符还是表示可选项？
4. “0 [lookahead ∉ DecimalDigit]” 和 “&lt;CR&gt;[lookahead ≠ &lt;LF&gt;]”使用正则分别该如何表达？

谢谢答疑解惑～