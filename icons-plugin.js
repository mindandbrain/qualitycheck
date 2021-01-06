const got = require("got");

const valueParser = require("postcss-value-parser");
const { transform, encode } = require("postcss-inline-svg/lib/defaults");

const fname = "icon";

const requireIconSvg = (iconId) => {
  return new Promise((resolve) => {
    got(`https://fonts.gstatic.com/s/i/materialicons/${iconId}/24px.svg?download=true`).then(
      (response) => {
        resolve(response.body);
      }
    );
  });
};

module.exports = (opts = {}) => (css) => {

  const nodepromises = new Array();

  css.walkDecls((node) => {

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

      nodepromises.push(
        Promise.all(promises).then(() => {
          node.value = parsedValue.toString();
        })
      );
    }

  });

  return Promise.all(nodepromises);
};

module.exports.postcss = true;
