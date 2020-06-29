module.exports = {
  plugins: [
    require("postcss-normalize")({}),
    require("./icons-plugin.js")({}),
    require("cssnano")({}),
  ],
};
