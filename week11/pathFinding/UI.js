import { wide, deep } from "./findpath.js";

export default class UI {
  constructor() {
    this.cfg = {
      board: [50, 50], // 棋盘
      point: {
        space: {
          desc: "空白格子",
          value: 0,
          className: "",
        },
        wall: {
          desc: "障碍物",
          value: -1,
          className: "draw",
        },
        find: {
          desc: "寻路过程",
          value: 1,
          className: "walk",
        },
        path: {
          desc: "路径",
          value: 9,
          className: "path",
        },
      },
      start: [0, 25],
      end: [49, 25],
    };
    this.defaultData = new Array(this.cfg.board[0] * this.cfg.board[1]).fill(0);
    this.defaultData[
      this.cfg.board[0] * this.cfg.start[1] + this.cfg.start[0]
    ] = this.cfg.point.path.value;
    this.defaultData[
      this.cfg.board[0] * this.cfg.end[1] + this.cfg.end[0]
    ] = this.cfg.point.path.value;
    this.data = this.defaultData.slice();
    this.root = null;
  }
  addEvent() {
    const self = this;
    const elm_btn_save = document.getElementById("btn_save");
    const elm_btn_restore = document.getElementById("btn_restore");
    const elm_btn_reset = document.getElementById("btn_reset");
    const elm_btn_reload = document.getElementById("btn_reload");
    const elm_btn_find = document.getElementById("btn_find");
    const drawWallHandler = this.throttle(this.drawWall, 20);

    /* 事件 */
    this.root.addEventListener("mouseover", drawWallHandler.bind(self));
    this.root.addEventListener("click", drawWallHandler.bind(self));

    elm_btn_find.addEventListener("click", () => {
      wide.bind(self)(self.cfg.start, self.cfg.end);
      // deep.bind(self)([0, 0], [12, 12]);
    });
    elm_btn_save.addEventListener("click", () => {
      const str = JSON.stringify(this.data);
      localStorage.setItem("data", str);
      console.log("数据已保存");
    });
    elm_btn_restore.addEventListener("click", () => {
      let localData = localStorage.getItem("data");
      if (localData == null) return;
      localData = JSON.parse(localData);
      if (localData.length !== self.data.length) {
        console.log(`数据长度不匹配，无法恢复`);
        return;
      }
      self.data = self.deepCopy(localData);
      console.log(`数据已经恢复，视图重新渲染`);
      self.renderBackground();
    });
    elm_btn_reset.addEventListener("click", () => {
      localStorage.clear();
      self.data = self.deepCopy(self.defaultData);
      console.log(`数据已经清除，视图重新渲染`);
      self.renderBackground();
    });
    elm_btn_reload.addEventListener("click", () => {
      self.data = self.deepCopy(self.defaultData);
      console.log(`视图已重置`);
      self.renderBackground();
    });
  }
  renderBackground(element) {
    const self = this;
    self.root = element || self.root;
    self.root.innerHTML = null;
    const { space, wall, find, path } = self.cfg.point;
    const board = self.cfg.board;

    function htmlStr() {
      let trs = [];
      // table
      for (let y = 0; y < board[1]; y++) {
        let tr = [];
        for (let x = 0; x < board[0]; x++) {
          const position = JSON.stringify({ x, y });
          const className =
            self.data[y * board[0] + x] === -1
              ? wall.className
              : self.data[y * board[0] + x] === 1
              ? find.className
              : self.data[y * board[0] + x] === 9
              ? path.className
              : space.className;
          const td = `<td class=${className} 
          data-value=${self.data[board[0] * y + x]}
          data-position=${position}
          title=${position}
          ></td>`;
          tr.push(td);
        }
        trs.push(`<tr>${tr.join("")}</tr>`);
      }
      let table = `<table id="board">
      <tbody>${trs.join("")}</tbody></table>`;
      // btns
      const btns = `<div>
      <button id="btn_save">保存数据到本地</button>
      <button id="btn_restore">从本地恢复数据</button>
      <button id="btn_reset">清除本地数据</button>
      <button id="btn_reload">重置页面状态</button>
    </div>
    <div>
      <button id="btn_find">开始计算</button>
    </div>`;

      return table + btns;
    }
    self.root.innerHTML = htmlStr();
    self.addEvent();
  }
  drawWall(e) {
    e.preventDefault();
    const self = this;
    const tg = e.target;
    if (e.type === "mouseover" && e.buttons === 0) return;
    if (tg.tagName !== "TD") return;
    const { className } = self.cfg.point.wall;
    const { x, y } = JSON.parse(tg.dataset.position);
    if (e.altKey) {
      tg.classList.remove(className);
      if (self.data[y * self.cfg.board[0] + x] === self.cfg.point.wall.value)
        self.data[y * self.cfg.board[0] + x] = self.cfg.point.space.value;
    } else {
      tg.classList.add(className);
      self.data[y * self.cfg.board[0] + x] = self.cfg.point.wall.value;
    }
  }
  /* 节流 */
  throttle(fn, delay) {
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
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
