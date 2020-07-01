let t = null;
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
function go() {
  light("green");
  happen(document.body, "click", 2000)
    .then(() => {
      light("yellow");
      return happen(document.body, "click", 2000);
    })
    .then(() => {
      light("red");
      return happen(document.body, "click", 2000);
    })
    .then(() => {
      go();
    });
}
go();
