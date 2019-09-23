/*
*/

import pug from "rollup-plugin-pug";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import { makeBundle } from "./make-bundle-plugin.js";

import { fullName, version } from './package.json';
const isProduction = process.env.NODE_ENV === "production";

export default (async () => ({
  input: "src/js/index.js",
  output: {
    name: "qualitycheck",
    file: "index.js",
    format: "iife"
  },
  plugins: [
    pug({
      compileDebug: !isProduction
    }),
    babel({
      exclude: "node_modules/**",
      babelrc: false,
      presets: [
          "@babel/preset-env"
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties"
      ]
    }),
    postcss({
      modules: true,
      use: ["sass"],
      minimize: isProduction,
      extract: true
    }),
    isProduction && terser({
      output: {
        comments: "some",
        semicolons: false,
        ecma: 8        
      },
      ecma: 8,
      compress: {
        passes: 5
      }
    }),
    makeBundle({
      pageTitle: `${fullName} ${version}`,
      template: "src/pug/index.pug",
      outputPath: "dist/index.html"
    })
  ]
}))();