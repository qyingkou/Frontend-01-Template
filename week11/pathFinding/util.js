/* ? */

export class Sorted {
  constructor(data, compare) {
    this.data = data || [];
    this.compare =
      compare ||
      function (a, b) {
        return a - b;
      };
  }
  /* 拿一个数组中的最小值 */
  take() {
    let minIndex = 0;
    const data = this.data;
    data.forEach((item, index) => {
      if (this.compare(data[minIndex], item) > 0) {
        minIndex = index;
      }
    });
    return data.splice(minIndex, 1)[0];
  }
  push(i) {
    this.data.push(i);
  }
  get length() {
    return this.data.length;
  }
}
