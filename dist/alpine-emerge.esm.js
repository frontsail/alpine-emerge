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
export {
  module_default as default
};
