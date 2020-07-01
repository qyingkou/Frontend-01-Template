function* go() {
  while (true) {
    light("green");
    yield sleep(1000);
    light("yellow");
    yield sleep(1000);
    light("red");
    yield sleep(1000);
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function co(iterator) {
  const { value: promise } = iterator.next();
  promise.then(() => {
    co(iterator);
  });
}

co(go());
