function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
async function go() {
  while (true) {
    light("green");
    await sleep(1000);
    light("yellow");
    await sleep(1000);
    light("red");
    await sleep(1000);
  }
}
go();
