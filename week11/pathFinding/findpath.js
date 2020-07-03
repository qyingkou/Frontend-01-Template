/* 广度优先 */
export async function wide(start, end) {
  const self = this;
  const [numX, numY] = this.cfg.board;
  const { space, wall, find, path } = this.cfg.point;
  let queue = [start];
  let data = self.data.slice();

  while (queue.length) {
    let [x, y] = queue.shift();
    if (x === end[0] && y === end[1]) {
      return await stroke([x, y]); // 描绘最短路径
    }

    // 描绘周围8个探路点,按逆时针旋转
    /*
    await fill([x, y + 1], [x, y]);
    await fill([x + 1, y + 1], [x, y]);
    await fill([x + 1, y], [x, y]);
    await fill([x + 1, y - 1], [x, y]);
    await fill([x, y - 1], [x, y]);
    await fill([x - 1, y - 1], [x, y]);
    await fill([x - 1, y], [x, y]);
    await fill([x + 1, y + 1], [x, y]);
    */

    // 描绘周围8个探路点,按顺时针旋转
    // 对于斜角穿透问题，加入判断
    await fill([x, y + 1], [x, y]);
    if (data[numX * y + x - 1] === 0 || data[numX * (y + 1) + x] === 0)
      await fill([x - 1, y + 1], [x, y]);
    await fill([x - 1, y], [x, y]);
    if (data[numX * y + x - 1] === 0 || data[numX * (y - 1) + x] === 0)
      await fill([x - 1, y - 1], [x, y]);
    await fill([x, y - 1], [x, y]);
    if (data[numX * y + x + 1] === 0 || data[numX * (y - 1) + x] === 0)
      await fill([x + 1, y - 1], [x, y]);
    await fill([x + 1, y], [x, y]);
    if (data[numX * y + x + 1] === 0 || data[numX * (y + 1) + x] === 0)
      await fill([x + 1, y + 1], [x, y]);
  }

  // 描绘探路
  async function fill([x, y], pre) {
    if (data[numX * y + x] !== space.value && data[numX * y + x] !== path.value)
      return;
    if (x < 0 || y < 0 || x > numX - 1 || y > numX - 1) return;
    queue.push([x, y]);
    data[numX * y + x] = pre;
    await draw(self.root, [x, y]);
  }
  // 描绘最短路径
  async function stroke([x, y]) {
    let p = []; // 描边路径
    while (x !== start[0] || y !== start[1]) {
      p.push([x, y]);
      await draw(self.root, [x, y], path.className);
      await sleep(10);
      [x, y] = data[y * numX + x];
    }
    await draw(self.root, start, path.className);
    return p;
  }

  return null;
}

/* ====================深度优先========================== */
export async function deep(start, end) {
  const self = this;
  const [numX, numY] = this.cfg.board;
  const { space, wall, find, path } = this.cfg.point;
  let stack = [start]; // 栈
  let data = self.data.slice();

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x === end[0] && y === end[1]) {
      return await stroke([x, y]); // 描绘最短路径
    }
    // 描绘探路面积
    await fill([x - 1, y], [x, y]);
    await fill([x - 1, y - 1], [x, y]);
    await fill([x + 1, y], [x, y]);
    await fill([x + 1, y + 1], [x, y]);
    await fill([x, y - 1], [x, y]);
    await fill([x - 1, y - 1], [x, y]);
    await fill([x, y + 1], [x, y]);
    await fill([x + 1, y + 1], [x, y]);
  }
  function update(x, y) {
    if (data[numX * y + x] !== space.value) return;
    if (x < 0 || y < 0 || x > numX - 1 || y > numX - 1) return;
    stack.push([x, y]);
    data[numX * y + x] = find.value;
    drawArea(self.root, [x, y]);
  }
  return false;
}

async function draw(element, position, className) {
  const clazz = className || "walk";
  const trs = element.getElementsByTagName("tr");
  const tds = trs[position[1]].getElementsByTagName("td");
  tds[position[0]].classList.add(clazz);
  await sleep(10);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
