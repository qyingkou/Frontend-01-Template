## 作业任务

### 作业 1:convertStringToNumber

> 思路

```
拆分出各个进制的方法，降低复杂度
利用week02做过的字符串字面量正则，export出来供各个进制转换的方法使用：
    - isBinaryNumber
    - isOctalNumber
    - isDecimalNumber
    - isHexNubmer
判断是否为该进制，不符合的返回NaN
    十进制时：
        - 当字符串是指数型时
        - 当字符串是非指数型时
            - 当字符串是整数时
            - 当字符串是浮点数时
    二进制时：
    八进制时：
    十六进制时：
    其他：
        - 解析负数
        - 解析整数和小数部分
        - 解析出exponent部分
        - 以0或a的码点为参考，其他字符码点可以通过步长得出数值
```

### 作业 2:convertNumberToString

> 思路

```
拆出各个进制降低复杂度
排除Undefined、null、NaN
区分正负
根据进制判断：
    - 十进制
        - 整数还是浮点数，integer + fraction
        - 是否为指数,   integer(.fraction)E(exponent)
    - 二进制
        - 0b<二进制位数值>
    - 八进制
        - 0o<八进制位数值>
    - 十六进制
        - 0x<十六进制数值>
    - 其他：
        - 以0或a的码点为参考，每一位的数字转换为字符
```

---

## 周报

### 找出 JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？写一篇文章，放在学习总结里。

https://tc39.es/ecma262/#sec-ordinary-and-exotic-objects-behaviours
（看懂了再写吧）

### 学习记录

> 表达式：分语法部分和运行时部分

#### 语法部分
- 成员访问运算符
    - a.b
    - a[b]
    - foo \`stringTpl\`
    - super.b // 调用父类的方法
    - super['b']
    - new.target
    - new Foo()
- new运算符
- [[Call]]运算符
    - foo()
    - super()
    - foo()['b']
    - foo().b
    - foo\`stringTpl\`
- Left hand side（左值表达式，左值必须是Reference类型）
    - a.b = c;
    - a+b = c; // ???
- Right hand side
    - Update 自增运算符（必须是Number）
        - a++
        - a--
        - --a
        - ++a
    - Unary 一元运算符
        - delete a.b 
        - void foo()
        - typeof a
        - +a  // 必须是number
        - -a  // 必须是number
        - ~a 位运算 // 必须是number且是整数
        - !a	非 （逻辑符中只有非才做类型转换，与或并不做类型转换）
        - await a //  必须是promise
    - Exponental 指数运算符
        - **
    - Multiplicative 乘法运算符
        - \*
        - /
        - %
    - Additive 加法运算符
        - \+
        - \-
    - Shift 移位运算符
        - <<
	    - \>>
	    - \>>>
    - RelationShip 关系比较运算符
        - \<
        - \>
        - \<=
        - \>=      
    - Logic 逻辑运算符
        - || 或，true惰性
        - && 与，false惰性
    - Conditional 三元表达式
        - ？：
    - Equality 等号运算符
        - ==
        - !=
        - ===
        - !==
    - Bitwise 按位操作符
        - &
        - ^
        - |

#### 运行时部分

> 语句:分语法部分和运行时部分

#### 语法部分：

- 简单语句
  - 表达式语句
  - 空语句（就一个分号）
  - Debugger 语句
  - 抛错语句
  - continue 语句
  - break 语句
  - return 语句
- 组合语句
  - 块语句
  - If 语句
  - switch 语句
  - Iteration 语句
    - while
    - do while
    - for
    - for in
    - for of
    - for await of
  - with 语句
  - 标签语句
  - Try 语句
- 声明
  - 函数声明
  - Generator 声明
  - Async 函数声明
  - Async Generator 声明
  - 变量声明
  - 类（class）声明
  - 词法声明

#### 运行时语法 
- completion Record 
- lexical Enviroment
