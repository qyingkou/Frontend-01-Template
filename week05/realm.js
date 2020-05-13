/*
 * Realm的构成
 */
const Realm = {
  GlobalObject: GlobalObject(),
  Intrinsics: null,
  GlobalEnv: null,
  TemplateMap: null,
  HostDefined: null,
};
function GlobalObject() {
  return {
    value_proterties: [
      // "globalThis",
      // "Infinity",
      // "NaN",
      // "undefined",
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

const o = new Set(
  Object.keys(Realm.GlobalObject)
    .map((key) => {
      return Realm.GlobalObject[key];
    })
    .flat()
);

const self = window;
let queue = [];
o.forEach((item) => {
  queue.push({
    path: [item],
    object: self[item],
  });
});

while (queue.length > 0) {
  const current = queue.shift();
  if (current.object === null || current.object === void 0) continue;
  if (o.has(current.object)) continue;
  o.has(current.object);
  console.log(current.path);

  for (let property of Object.getOwnPropertyNames(current.object)) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      current.object,
      property
    );
    // console.log(propertyDescriptor);

    queue.push({
      path: current.path.concat([property]),
      object: property.value,
    });
  }
}
console.log(o.size);
