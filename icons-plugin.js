const got = require("got");
const cacache = require("cacache");

const postcss = require("postcss");
const valueParser = require("postcss-value-parser");
const { transform, encode } = require("postcss-inline-svg/lib/defaults");

const cachePath = ".icons";

const fname = "icon";

const requireIconSvg = (iconId) => {
  return new Promise((resolve) => {
    cacache
      .get(cachePath, iconId)
      .catch(() => {
        got(
          `https://fonts.gstatic.com/s/i/materialicons/${iconId}/24px.svg?download=true`
        ).then((response) => {
          cacache.put(cachePath, iconId, response.body).then(() => {
            resolve(response.body);
          });
        });
      })
      .then((cacheEntry) => resolve(String(cacheEntry.data)));
  });
};

module.exports = postcss.plugin("postcss-icons", (opts = {}) => async (css) => {
  await css.walkDecls(async (node) => {
    if (node.value.indexOf(fname) !== -1) {
      const parsedValue = valueParser(node.value);
      const promises = new Array();
      parsedValue.walk((valueNode) => {
        if (valueNode.type === "function") {
          if (valueNode.value === fname) {
            const iconIdNode = valueNode.nodes[0];
            if (iconIdNode.type !== "string") {
              throw new Error(`Invalid decl ${node.value}`);
            }
            const iconId = iconIdNode.value;
            promises.push(
              requireIconSvg(iconId).then((svg) => {
                const dataUri = transform(encode(svg));
                valueNode.value = "url";
                valueNode.nodes = [
                  {
                    type: "word",
                    value: dataUri,
                  },
                ];
              })
            );
          }
        }
      });
      await Promise.all(promises).then(() => {
        node.value = parsedValue.toString();
      });
    }
  });
});
