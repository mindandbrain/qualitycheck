const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const InlinePlugin = require("./inline-plugin.js");

const base = {
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
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
        use: [
          "raw-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["absolute/path/a", "absolute/path/b"],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mode: "production",
    ...base,
    plugins: [
      new HtmlWebpackPlugin(),
      new InlinePlugin(),
      new CleanWebpackPlugin(),
      // new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    optimization: {
      usedExports: true,
      splitChunks: {
        name: true,
      },

      concatenateModules: true,
    },
  };
} else if (process.env.NODE_ENV === "development") {
  module.exports = {
    mode: "development",
    ...base,
    plugins: [new HtmlWebpackPlugin()],
    watch: true,
    devServer: {
      publicPath: "/",
      compress: true,
      contentBase: path.resolve(__dirname, "public"),
      hotOnly: true,
    },
  };
}
