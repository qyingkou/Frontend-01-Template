let t = null;

function* go() {
  while (true) {
    light("green");
    yield happen(document.body, "click", 1000);
    light("yellow");
    yield happen(document.body, "click", 1000);
    light("red");
    yield happen(document.body, "click", 1000);
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

function happen(element, eventName, ms) {
  return new Promise((resolve) => {
    t = setTimeout(() => {
      element.removeEventListener(eventName, handler);
      resolve();
    }, ms);
    element.addEventListener(eventName, handler, { once: true });
    function handler() {
      clearTimeout(t);
      resolve();
    }
  });
}

co(go());
