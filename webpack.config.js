const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const InlinePlugin = require("./inline-plugin.js");

const base = {
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mode: "production",
    ...base,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ["babel-loader", "ts-loader"],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ["raw-loader", "postcss-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "qualitycheck",
        inject: "body",
      }),
      new InlinePlugin(),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      usedExports: true,
      splitChunks: {
        name: false,
      },

      concatenateModules: true,
    },
  };
} else if (process.env.NODE_ENV === "development") {
  module.exports = {
    mode: "development",
    ...base,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ["raw-loader", "postcss-loader", "sass-loader"],
        },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ title: "qualitycheck" })],
    watch: true,
    devServer: {
      publicPath: "/",
      compress: true,
      contentBase: path.resolve(__dirname, "public"),
      hotOnly: true,
    },
  };
}
