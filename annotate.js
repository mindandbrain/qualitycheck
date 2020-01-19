"use strict";

const PLUGIN_NAME = "templates";

const through = require("through2");
const { src, dest, series, parallel } = require("gulp");
var PluginError = require("plugin-error");

const camelCase = require("camelcase");
const { join, dirname, parse } = require("path");

const beautify = require("js-beautify").js;

const path = require("path");
const fs = require("fs");

const tsickle = require("tsickle");
const ts = require("typescript");

const annotate = (cb) => {
  const sourceFile = path.join(process.cwd(), "./src/ts/index.ts");
  const configFileName = "./tsconfig.json";
  const outputPath = "./generated/js/";

  var config = ts.readConfigFile(configFileName, 
    (path) => fs.readFileSync(path, "utf-8")
  );
    
  var options = ts.parseJsonConfigFileContent(config.config, // json
    ts.sys, // host
    process.cwd(), // basePath
    [], // existingOptions
    configFileName
  );

  var compilerHost = ts.createCompilerHost(options.options);
  var program = ts.createProgram([sourceFile], options.options, compilerHost);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length > 0) {
      console.error(ts.formatDiagnostics(diagnostics, compilerHost));
  }

  const recursiveGetStrings = (v) => {
    let r = [];
      for (let key in v) {
        if (typeof v[key] === "string") {
          r.push(v[key]);
        } else {
          r.push(...recursiveGetStrings(v[key]));
        }
      }
    return r;
  };

  const convertToGoogModuleAdmissibleName = (modulePath) => {
  	return modulePath
  		.replace(/\.[tj]sx?$/, '') //remove file extension
  		.replace(/[\/\\]/g, '.')
  		.replace(/^[^a-zA-Z_$]/, '_')
  		.replace(/[^a-zA-Z0-9._$]/g, '_');
  }

  let inputFolders = recursiveGetStrings(options.options.paths)
    .map(path.dirname)
    .map(v => path.resolve(v));

  var jsFiles = {};
  var transformerHost = {
     shouldSkipTsickleProcessing: (fileName) => false,
     shouldIgnoreWarningsForPath: (fileName) => true,
     
     fileNameToModuleId: (fileName) => path.relative(process.cwd(), fileName),
     pathToModuleName: (context, fileName) => {
      if (fileName === "tslib") return fileName;

      const resolved = ts.resolveModuleName(fileName, context, options, compilerHost);
      
      if (resolved && resolved.resolvedModule) {
        fileName = resolved.resolvedModule.resolvedFileName;
      }
      
      const origin = inputFolders.find((v) => fileName.startsWith(v));
      if (origin) {
        fileName = path.relative(origin, fileName);
      }
      
      return convertToGoogModuleAdmissibleName(fileName);
     },
     
     es5Mode: true,
     googmodule: true,
     untyped: false,
     
     convertIndexImportShorthand: true,
     transformDecorators: true,
     transformTypesToClosure: true,
     
     typeBlackListPaths: new Set(),
     
     host: compilerHost,
     moduleResolutionHost: compilerHost,
     
     logWarning: (warning) => {
       const fmt = ts.formatDiagnostics([warning], compilerHost);
       if (!fmt.startsWith("node_modules"))
        console.error(fmt);
     },
     
     options
  };

  var result = tsickle.emitWithTsickle(program, 
                                       transformerHost, 
                                       compilerHost, 
                                       options, 
                                       undefined, 
    (fileName, src) => {
      const origin = inputFolders.find((v) => fileName.startsWith(v));
      fileName = path.relative(origin, fileName);
      
      fileName = path.resolve(outputPath, fileName);
      
      fs.mkdirSync(path.dirname(fileName), { 
        recursive: true 
      });

      fs.writeFileSync(fileName, src);
    }
  );

  const externsPath = path.resolve(outputPath, "externs.js");

  fs.writeFileSync(externsPath, ""); // truncate
  Object.entries(result.externs)
    .forEach(([k, src]) => {
      if (options.fileNames.includes(k)) {
        fs.appendFileSync(externsPath, src + "\n");
      }
    }
  );
  
  cb();
};
module.exports = annotate;
