function go() {
  setTimeout(function () {
    light("green");
    setTimeout(function () {
      light("yellow");
      setTimeout(function () {
        light("red");
        setTimeout(go, 1);
      }, 1000);
    }, 1000);
  }, 1000);
}
go();

/* 
  使用setTimeout设定定时器，通过宏任务实现异步执行
  使用递归实现无限循环
  缺点：
    回调地狱
    每一轮setTimeout总会有延时
    本轮的宏任务延时情况，受上一轮任务的影响
 */
