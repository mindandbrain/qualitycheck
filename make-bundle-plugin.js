//

import { renderFile } from "pug";

import { dirname } from "path";
import { writeFile, mkdir } from "fs";

export const makeBundle = (options) => {
  return {
    name: "makeBundle",
    generateBundle(outputOptions, bundle) {
      var js = "", css = "";
      
      const bundleEntries = Object.entries(bundle);
      for (const [key, value] of bundleEntries) {
        if (key.endsWith("js")) {
          js += value.code;
        } else if (key.endsWith("css")) {
          css += value.source;
        }
        delete bundle[key]
      }
      
      var html = renderFile(options.template, {
        ...options,
        css, js
      });
      
      mkdir(dirname(options.outputPath), { 
        recursive: true 
      }, (error) => {
        if (error) {
          console.log(error);
          throw error;
        }
      });
      
      writeFile(options.outputPath, html, (error) => {
        if (error) {
          console.log(error);
          throw error;
        }
      });
    }
  };
};