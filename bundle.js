#!/usr/bin/env node 

const path = require("path");
const fs = require("fs");

const glob = require("glob");

const ClosureCompiler = require("google-closure-compiler").jsCompiler;

const sass = require("node-sass");
const postcss = require("postcss");
const postcssNormalize = require("postcss-normalize");
const cssnano = require("cssnano");

const pug = require("pug");
const jsBeautify = require("js-beautify");

const package = require("./package.json");

const bundle = (cb) => {

  const jsPath = "./generated/js/";
  const selector = "**/*.js";

  const scssPath = "src/scss/index.scss";

  const templatePath = "src/pug/index.pug";

  const templateOptions = {
    pageTitle: `${package.fullName} ${package.version}`
  };
  const outputPath = "generated/index.html";

  //
  //

  const isProduction = process.env.NODE_ENV === "production";

  const compilejs = () => new Promise(resolve => {
    const externs = [ path.resolve(jsPath, "externs.js") ];
    const js = glob.sync(path.join(jsPath, selector))
      .map(v => path.resolve(v))
      .filter(v => {
        return v !== externs[0];
      })
      .map(path => ({ path, 
        src: fs.readFileSync(path, "utf-8"),
        sourceMap: null 
      }));

    js.push({
      path: "base.js",
      src: "var goog;",
      sourceMap: null
    });


    let settings = {
      externs,
      entry_point: "index",

      compilation_level: "ADVANCED",
      strict_mode_input: true,

      generate_exports: true,

      assume_function_wrapper: false,
      isolation_mode: "IIFE",

      rewrite_polyfills: false,

      module_resolution: "NODE",
      language_in: "ECMASCRIPT_NEXT",
      language_out: "ECMASCRIPT_NEXT",

      warning_level: "VERBOSE",

      use_types_for_optimization: true
    };

    if (!isProduction) {
      settings.formatting = "PRETTY_PRINT";
    }

    var instance = new ClosureCompiler(settings);

    var compilerProcess = instance.run(js, 
      (exitCode, code, stdErr) => {
        console.error(stdErr);

        resolve(code[0].src);
      }
    );
  });

  const compilecss = () => new Promise(resolve => {
    const sassResult = sass.renderSync({
      file: scssPath
    });

    let postcssPlugins = [ postcssNormalize, cssnano ];

    postcss(postcssPlugins)
      .process(sassResult.css, { from: scssPath, to: "generated/index.css" })
      .then(result => {
        if (result.messages) {
          result.messages.forEach(console.error);
        }
        resolve(result.css);
      });
  });

  (async () => {
    try {
      const js = await compilejs();
      const css = await compilecss();

      var html = pug.renderFile(templatePath, {
        ...templateOptions,
        css, js
      });

      if (!isProduction) {
        html = jsBeautify.html(html, { 
          indent_size: 2, 
          space_in_empty_paren: true 
        });
      };

      fs.mkdirSync(path.dirname(outputPath), { 
        recursive: true 
      });

      fs.writeFileSync(outputPath, html);
      cb();
    } catch (e) {
      console.error(e);
    }
  })();
};

module.exports = bundle;
