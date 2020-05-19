module.exports = {
  has,
};

const mimes = [
  "text/plain",
  "text/css",
  "text/html",
  "text/javascript",
  "multipart/form-data",
  "application/json",
  "application/x-www-form-urlencoded",
];
function has(mime) {
  return mimes.includes(mime);
}
