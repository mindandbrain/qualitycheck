/*
*/

import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2"
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import postcssNormalize from "postcss-normalize";
import { terser } from "rollup-plugin-terser";
import { makeBundle } from "./make-bundle-plugin.js";

import { fullName, version } from "./package.json";
const isProduction = process.env.NODE_ENV === "production";

export default (async () => ({
  input: "src/ts/index.ts",
  output: {
    name: "qualitycheck",
    file: "generated/index.js",
    format: "iife"
  },
  plugins: [
    nodeResolve({}),
    typescript({
      typescript: require("typescript"),
      clean: true,
      verbosity: 3,
      exclude: [],
      declarationDir: "generated/"
    }),
    postcss({
      modules: false,
      use: ["sass"],
      minimize: isProduction,
      extract: true,
      plugins: [
        postcssNormalize({
          
        })
      ]
    }),
    terser({
      output: {
        beautify: !isProduction,
        comments: "some",
        semicolons: false,
        ecma: 8        
      },
      ecma: 8,
      compress: {
        passes: 5,
        keep_fargs: false,
        toplevel: true,
        top_retain: [ "qualitycheck" ],
        unsafe: true,
        warnings: true
      },
      mangle: isProduction ? {
        module: true,
        eval: true,
        reserved: [ "qualitycheck" ],
        properties: {
          undeclared: true,
          keep_quoted: true,
          debug: !isProduction,
          reserved: [ "id", "fname", "sources",
            "it", "sub", "task", "run", "on", "off" ]
        } 
      } : false
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
    makeBundle({
      pageTitle: `${fullName} ${version}`,
      template: "src/pug/index.pug",
      outputPath: "generated/index.html"
    })
  ]
}))();