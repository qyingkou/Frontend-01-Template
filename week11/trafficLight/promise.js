function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function go() {
  light("green");
  sleep(1000)
    .then(() => {
      light("yellow");
      return sleep(1000);
    })
    .then(() => {
      light("red");
      return sleep(1000);
    })
    .then(() => {
      go();
    });
}
go();

/* 
  通过微任务，异步执行代码
  通过promise的链式调用，将代码分布在各个then当中
  通过使用setTimeout来控制resolve的执行时机，从而控制分布在then当中的代码的执行
  缺点：
    本质上还是回调的写法
    需要链式写then，必须return一个promise，稍显麻烦
 */
