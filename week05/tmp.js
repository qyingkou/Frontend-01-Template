/*
 * Realm的构成
 */
const Realm = {
  GlobalObject: GlobalObject(),
  Intrinsics: "", // ?
  GlobalEnv: "", // ?
  TemplateMap: "", // ?
  HostDefined: "", // ?
};
function GlobalObject() {
  return {
    value_proterties: [
      //   "globalThis",
      //   "Infinity",
      //   "NaN",
      //   "undefined",
    ],
    function_proterties: [
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
    ],
    constructor_properties: [
      "Array",
      "ArrayBuffer",
      "BigInt",
      "BigInt64Array",
      "BigUint64Array",
      "Boolean",
      "DataView",
      "Date",
      "Error",
      "EvalError",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Number",
      "Object",
      "Promise",
      "Proxy",
      "RangeError",
      "ReferenceError",
      "RegExp",
      "Set",
      "SharedArrayBuffer",
      "String",
      "Symbol",
      "SyntaxError",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "URIError",
      "WeakMap",
      "WeakSet",
    ],
    other_properties: ["Atomics", "JSON", "Math", "Reflect"],
  };
}

/* =========================GlobalObject_Array============================== */
const orignSet = new Set(
  Object.keys(Realm.GlobalObject)
    .map((key) => {
      return Realm.GlobalObject[key];
    })
    .flat()
);

/* ===========================?============================ */
const self = window;
let queue = [];
for (let p of [...orignSet]) {
  queue.push({
    path: [p],
    object: self[p],
  });
}

let current;
let data = [];

while (queue.length) {
  current = queue.shift();
  if (orignSet.has(current.object)) continue;
  orignSet.add(current.object);
  data.push(current.path);

  for (let p of Object.getOwnPropertyNames(current.object)) {
    var property = Object.getOwnPropertyDescriptor(current.object, p); // 获取对象的descriptor

    if (property.hasOwnProperty("value") && property.value instanceof Object) {
      queue.push({
        path: current.path.concat([p]),
        object: property.value,
      });
    }

    if (property.hasOwnProperty("get") && typeof property.get === "function") {
      queue.push({
        path: current.path.concat([p]),
        object: property.get,
      });
    }

    if (property.hasOwnProperty("set") && typeof property.set === "function") {
      queue.push({
        path: current.path.concat([p]),
        object: property.set,
      });
    }
  }
}

console.log("data", data);
