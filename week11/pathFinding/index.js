const CFG = {
  X: 30,
  Y: 30,
};
const defaultData = new Array(CFG.X * CFG.Y).fill(0);
let data = deepCopy(defaultData);
const elm_board = document.getElementById("board");
renderBackground(data);

const elm_btn_save = document.getElementById("btn_save");
const elm_btn_restore = document.getElementById("btn_restore");
const elm_btn_reset = document.getElementById("btn_reset");
const elm_btn_reload = document.getElementById("btn_reload");
let throttleHandler = throttle(drawHandler, 25);

/* 事件 */
elm_board.addEventListener("mouseover", throttleHandler);
elm_board.addEventListener("click", throttleHandler);

elm_btn_save.addEventListener("click", () => {
  localStorage.setItem("data", JSON.stringify(data));
  console.log("数据已保存");
});
elm_btn_restore.addEventListener("click", () => {
  const localData = JSON.parse(localStorage.getItem("data"));
  if (localData != null) {
    if (localData.length !== data.length) {
      console.log(`本地数据当前数据长度不匹配，任务退出`);
      return;
    }
    data = deepCopy(localData);
    renderBackground(data);
    console.log(`数据已经恢复，视图重新渲染`);
  }
});
elm_btn_reset.addEventListener("click", () => {
  localStorage.clear();
  data = deepCopy(defaultData);
  renderBackground(data);
  console.log(`数据已经清除，视图重新渲染`);
});
elm_btn_reload.addEventListener("click", () => {
  data = deepCopy(defaultData);
  renderBackground(data);
  console.log(`视图已重置`);
});

/* 渲染底图 */
function renderBackground(data) {
  const tbody = document.createElement("tbody");
  for (let y = 0; y < CFG.Y; y++) {
    const tr = document.createElement("tr");
    for (let x = 0; x < CFG.X; x++) {
      const td = document.createElement("td");
      td.dataset.position = JSON.stringify({ x, y });
      if (data[y * CFG.X + x] === 1) td.classList.add("draw");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  elm_board.innerHTML = null;
  elm_board.appendChild(tbody);
}
/* drawHandler */
function drawHandler(e) {
  const tg = e.target;
  if (e.type === "mouseover" && e.buttons === 0) return;
  if (tg.tagName !== "TD") return;
  e.preventDefault();
  const { x, y } = JSON.parse(tg.dataset.position);
  if (e.altKey) {
    tg.classList.remove("draw");
    if (data[y * CFG.X + x] === 1) data[y * CFG.X + x] = 0;
  } else {
    tg.classList.add("draw");
    data[y * CFG.X + x] = 1;
  }
  // console.log(data.slice(-10));
}
/* 节流 */
function throttle(fn, delay) {
  let last, deferTimer;
  return function (args) {
    let self = this;
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(self, _args);
      }, delay);
    } else {
      last = now;
      fn.apply(self, _args);
    }
  };
}
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
