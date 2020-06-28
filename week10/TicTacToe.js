export default class App {
  constructor(elm) {
    this.pattern = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.chessType = 1; // 当前执棋类型,1为o,2为x
    this.chessesText = ["", "⭕", "❌"]; // 棋子名称
    this.status = 0; // 游戏状态：0(进行中),1(o方胜利),2(x方胜利),3(平局)
    this.statusText = ["", "⭕方胜利", "❌方胜利", "平局"]; // 游戏状态名称
    this.timer = null;
    this.root = null;
  }
  render(elm) {
    const self = this;
    this.root = this.root || elm;
    const html = (() => {
      const trs = self.pattern
        .map((item, index) =>
          [
            "<tr>",
            ...item.map((itm, idx) => {
              const position = {
                row: index,
                col: idx,
              };
              return `<td title='${JSON.stringify(position)}' 
              data-position='${JSON.stringify(position)}' 
              data-value='${itm}'>${self.chessesText[itm]}</td>`;
            }),
            "</tr>",
          ].join("")
        )
        .join("");
      return `<table id="chess"><tbody>${trs}</tbody></table>`;
    })();
    this.root.innerHTML = html;
    // 事件绑定
    document
      .getElementById("chess")
      .addEventListener("click", this.clickHandler.bind(this));
    // 蒙层
    if (this.status !== 0) {
      const elm = document.getElementById("mask");
      if (elm) elm.parentNode.removeChild(elm);
      const mask = document.createElement("div");
      mask.id = "mask";
      this.root.parentElement.appendChild(mask);
    }
  }
  clickHandler(e) {
    const self = this;
    const tg = e.target;
    if (!tg.dataset.position) return;
    if (tg.dataset.value !== "0") return;
    const { row, col } = JSON.parse(tg.dataset.position);
    this.move({ row, col });
  }
  move(position) {
    clearTimeout(this.timer);
    if (this.status !== 0) return;
    this.pattern[position.row][position.col] = this.chessType;
    this.check();
    this.chessType = 3 - this.chessType; // 交替执棋
  }
  /* 
    系统控制游戏状态
   */
  check() {
    if (this.status !== 0) return;
    const self = this;
    const lines = this.getLines();
    let willWinConsole = false;
    for (let i in lines) {
      const circleTypeNum = lines[i].circleTypeNum;
      const crossTypeNum = lines[i].crossTypeNum;
      const spaceNum = lines[i].spaceNum;
      const moreNumType = circleTypeNum > crossTypeNum ? "1" : "2";
      if (circleTypeNum === 3 || crossTypeNum === 3) {
        // 一方已经胜利
        clearTimeout(this.timer);
        this.status = moreNumType;
        this.win();
        break;
      } else if (
        !willWinConsole &&
        (circleTypeNum === 2 || crossTypeNum === 2) &&
        spaceNum > 0 &&
        moreNumType !== this.chessType
      ) {
        // 对方可能胜利
        this.maybeWin(moreNumType);
        willWinConsole = true;
      } else {
        // 如果棋盘无剩余空间
        if (!this.pattern.flat().includes(0)) {
          clearTimeout(this.timer);
          this.status = 3;
          this.alert();
          break;
        }
      }
    }
    this.render();
    // ai自动下棋
    if (this.status === 0 && this.chessType === 1) {
      this.timer = setTimeout(
        self.move.bind(self, self.computePosition()),
        500
      );
    }
  }
  win() {
    this.status = this.chessType;
    console.log(`${this.chessesText[this.chessType]}已经胜利`);
    this.alert();
  }
  maybeWin(type) {
    console.log(`${this.chessesText[type]}可能会胜利`);
  }
  willWin(type) {
    console.log(`${this.chessesText[type]}必将胜利`);
  }
  /* 
    检查游戏数据：检查每条直线
    @return {Array} - 线集合
    数据结构：
    [{
        serial:0,
        sameType:1,
        sameTypeNum:2,
        spaceNum:1,
        points:[{
          row:1,
          col:2,
          value:0
        },...]
      },...]
   */
  getLines() {
    let line_rows = [];
    let line_cols = [];
    let line_ltrb = [];
    let line_rtlb = [];
    let lines = [];
    for (let row = 0; row < 3; row++) {
      if (!line_rows[row]) line_rows[row] = [];
      for (let col = 0; col < 3; col++) {
        if (!line_cols[col]) line_cols[col] = [];
        const item = {
          row,
          col,
          value: this.pattern[row][col],
        };
        line_rows[row].push(item);
        line_cols[col].push(item);
        if (row === col) line_ltrb.push(item);
        if (row + col === 2) line_rtlb.push(item);
      }
    }

    [...line_rows, ...line_cols, line_ltrb, line_rtlb].forEach(
      (line, index) => {
        let circleTypeNum = 0;
        let crossTypeNum = 0;
        let spaceNum = 0;
        let set = new Set();
        for (let i in line) {
          const value = line[i].value;
          if (value === 0) {
            spaceNum++;
            continue;
          } else if (value === 1) {
            circleTypeNum++;
            continue;
          } else if (value === 2) {
            crossTypeNum++;
          }
        }
        lines.push({
          serial: index,
          spaceNum,
          circleTypeNum,
          crossTypeNum,
          points: line,
        });
      }
    );

    return lines;
  }
  alert() {
    const self = this;
    if (this.status === 0) return;
    setTimeout(() => {
      alert(self.statusText[this.status]);
    }, 1);
  }
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  computePosition() {
    const lines = this.getLines();
    let matchedLine;
    let moreNum = 0;
    // 筛选出最佳line
    for (let line of lines) {
      const spaceNum = line.spaceNum;
      const circleTypeNum = line.circleTypeNum;
      const crossTypeNum = line.crossTypeNum;
      let morePoint =
        spaceNum === 3
          ? 0
          : circleTypeNum === crossTypeNum
          ? null
          : circleTypeNum > crossTypeNum
          ? 1
          : 2;
      if (
        (circleTypeNum >= moreNum || crossTypeNum >= moreNum) &&
        spaceNum > 0
      ) {
        if (
          this.chessType !== morePoint &&
          (circleTypeNum === moreNum || crossTypeNum === moreNum)
        ) {
          continue;
        }
        matchedLine = line;
        moreNum = circleTypeNum > crossTypeNum ? circleTypeNum : crossTypeNum;
      }
    }
    // 如果没有匹配的matchedLine
    if (!matchedLine) {
      const name = 3 - this.chessType === 1 ? "circleTypeNum" : "crossTypeNum";
      let spacePoint;
      for (let line of lines) {
        if (line[name] !== 0) {
          matchedLine = line;
          break;
        }
        for (let i of line.points) {
          if (!spacePoint && i.value === 0) {
            spacePoint = { row: i.row, col: i.col };
          }
        }
      }
    }

    if (matchedLine) {
      return matchedLine.points.filter((item) => {
        return item.value === 0;
      })[0];
    } else {
      return spacePoint;
    }
  }
}
