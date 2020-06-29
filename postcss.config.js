module.exports = {
  plugins: [
    require("autoprefixer")({}),
    require("postcss-normalize")({}),
    require("./icons-plugin.js")({}),
    require("cssnano")({}),
  ],
};
