var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// builds/module.js
var module_exports = {};
__export(module_exports, {
  default: () => module_default
});
module.exports = __toCommonJS(module_exports);

// src/index.js
function src_default(Alpine) {
  Alpine.directive("emerge", async (el, { value, expression }, { effect, evaluateLater }) => {
    if (!_D) {
      return;
    }
    const root = el.content.firstElementChild;
    const cid = root.getAttribute("emerge-cid");
    const extra = root.getAttribute("emerge-extra");
    if (cid && value === "if") {
      const evaluator = evaluateLater(expression);
      effect(() => {
        evaluator((evaluated) => {
          if (evaluated) {
            resolve();
          }
        });
      });
    } else if (cid && value === "for") {
      const items = parseForExpression(expression).items;
      const evaluator = evaluateLater(items);
      effect(() => {
        evaluator((evaluated) => {
          if (typeof evaluated === "number" && evaluated > 0 || typeof evaluated === "object" && evaluated.length > 0) {
            resolve();
          }
        });
      });
    } else {
      resolve();
    }
    async function resolve() {
      if (cid) {
        await _D.emerge(cid, root, extra ? JSON.parse(extra) : void 0);
      }
      el.removeAttribute(`x-emerge:${value}`);
      setTimeout(() => el.setAttribute(`x-${value}`, expression));
    }
  });
  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\s*\(|\)\s*$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch)
      return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].replace(stripParensRE, "").trim();
    let iteratorMatch = item.match(forIteratorRE);
    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, "").trim();
      res.index = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }
    return res;
  }
}

// builds/module.js
var module_default = src_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
