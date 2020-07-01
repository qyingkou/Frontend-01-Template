async function go() {
  while (true) {
    light("green");
    await happen(document.body, "click", 3000);
    light("yellow");
    await happen(document.body, "click", 3000);
    light("red");
    await happen(document.body, "click", 3000);
  }
}
function happen(element, eventName, ms) {
  let t = null;
  return new Promise((resolve) => {
    // 两个resolve在竞争
    t = setTimeout(() => {
      element.removeEventListener("click", handler);
      resolve();
    }, ms);
    element.addEventListener(eventName, handler, { once: true });
    function handler() {
      clearTimeout(t);
      resolve();
    }
  });
}
go();
/* 
  既要无限循环亮灯
  同时要加入手动切换到下一盏灯的功能
 */
